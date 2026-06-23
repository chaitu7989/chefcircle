import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { signSession, COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/session'

export async function POST(req: NextRequest) {
  try {
    const { code, redirect_uri } = await req.json()
    if (!code || !redirect_uri) {
      return NextResponse.json({ error: 'Missing code or redirect_uri' }, { status: 400 })
    }

    // Exchange code for tokens directly with Google
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        redirect_uri,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = await tokenRes.json()
    if (!tokens.access_token) {
      console.error('[google-callback] token exchange failed:', tokens)
      return NextResponse.json({ error: tokens.error_description || 'Token exchange failed' }, { status: 401 })
    }

    // Get user profile from Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const googleUser = await userRes.json()

    if (!googleUser.email) {
      return NextResponse.json({ error: 'No email from Google' }, { status: 401 })
    }

    const admin = getSupabaseAdmin()

    // Find existing profile — maybeSingle returns null (not error) when no row found
    const { data: existing } = await admin
      .from('profiles')
      .select('id, role, onboarding_complete')
      .eq('email', googleUser.email)
      .maybeSingle()

    let userId: string
    let role: string
    let onboardingComplete: boolean
    let isNewUser = false

    if (existing) {
      // Returning user — update avatar/name silently
      userId = existing.id
      role = existing.role ?? 'customer'
      onboardingComplete = existing.onboarding_complete ?? false
      await admin.from('profiles').update({
        full_name: googleUser.name ?? undefined,
        avatar_url: googleUser.picture ?? undefined,
      }).eq('id', existing.id)
    } else {
      // New user — create profile
      const { data: newProfile, error: createErr } = await admin
        .from('profiles')
        .insert({
          phone: null,
          email: googleUser.email,
          full_name: googleUser.name ?? null,
          avatar_url: googleUser.picture ?? null,
        })
        .select('id, role, onboarding_complete')
        .single()

      if (createErr || !newProfile) {
        // Duplicate email — someone already registered with this email via phone
        // Find and use that profile instead
        const { data: fallback } = await admin
          .from('profiles')
          .select('id, role, onboarding_complete')
          .eq('email', googleUser.email)
          .maybeSingle()

        if (!fallback) {
          console.error('[google-callback] insert error:', createErr)
          return NextResponse.json({ error: createErr?.message ?? 'Failed to create profile' }, { status: 500 })
        }
        userId = fallback.id
        role = fallback.role ?? 'customer'
        onboardingComplete = fallback.onboarding_complete ?? false
      } else {
        userId = newProfile.id
        role = newProfile.role ?? 'customer'
        onboardingComplete = newProfile.onboarding_complete ?? false
        isNewUser = true
      }
    }

    const token = await signSession(userId, role as 'customer' | 'chef')
    const redirectTo = (isNewUser || !onboardingComplete)
      ? '/auth/onboarding'
      : role === 'chef' ? '/chef/dashboard' : '/customer/dashboard'

    const res = NextResponse.json({ redirectTo })
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    })
    return res

  } catch (err) {
    console.error('[google-callback] error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
