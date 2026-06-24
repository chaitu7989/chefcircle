import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { signSession, COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/session'

export async function POST(req: NextRequest) {
  try {
    const { code, redirect_uri } = await req.json()

    if (!code || !redirect_uri) {
      return NextResponse.json({ error: 'Missing code or redirect_uri' }, { status: 400 })
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'Google OAuth not configured on server' }, { status: 500 })
    }

    // Exchange code for tokens — .toString() required for Node.js fetch body
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri,
        grant_type: 'authorization_code',
      }).toString(),
      cache: 'no-store',
    })

    if (!tokenRes.ok) {
      const errText = await tokenRes.text()
      console.error('[google-callback] token exchange HTTP error:', tokenRes.status, errText)
      return NextResponse.json({ error: `Token exchange failed: ${tokenRes.status}` }, { status: 401 })
    }

    const tokens = await tokenRes.json()
    if (!tokens.access_token) {
      console.error('[google-callback] no access_token in response:', tokens)
      return NextResponse.json({ error: tokens.error_description || tokens.error || 'No access token' }, { status: 401 })
    }

    // Get user profile from Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
      cache: 'no-store',
    })

    if (!userRes.ok) {
      return NextResponse.json({ error: 'Failed to get user info from Google' }, { status: 401 })
    }

    const googleUser = await userRes.json()

    if (!googleUser.email) {
      return NextResponse.json({ error: 'No email returned from Google' }, { status: 401 })
    }

    const admin = getSupabaseAdmin()

    // maybeSingle() returns null (not error) when no row found
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
      userId = existing.id
      role = existing.role ?? 'customer'
      onboardingComplete = existing.onboarding_complete ?? false
      await admin.from('profiles').update({
        full_name: googleUser.name ?? undefined,
        avatar_url: googleUser.picture ?? undefined,
      }).eq('id', existing.id)
    } else {
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
        // Fallback: profile might exist already (race condition / duplicate)
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

    const token = await signSession(userId!, role as 'customer' | 'chef')
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
    console.error('[google-callback] unexpected error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
