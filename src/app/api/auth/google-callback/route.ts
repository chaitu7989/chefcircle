import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { signSession, COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/session'

export async function POST(req: NextRequest) {
  try {
    const { access_token } = await req.json()
    if (!access_token) {
      return NextResponse.json({ error: 'No token' }, { status: 400 })
    }

    // Get user info from Supabase using the access token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: { user }, error } = await supabase.auth.getUser(access_token)
    if (error || !user || !user.email) {
      console.error('[google-callback] getUser error:', error)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const admin = getSupabaseAdmin()

    // Find existing profile by email
    const { data: existing } = await admin
      .from('profiles')
      .select('id, role, onboarding_complete')
      .eq('email', user.email)
      .single()

    let userId: string
    let isNewUser = false

    if (existing) {
      userId = existing.id
      await admin.from('profiles').update({
        full_name: user.user_metadata?.full_name ?? undefined,
        avatar_url: user.user_metadata?.avatar_url ?? undefined,
      }).eq('id', existing.id)
    } else {
      const { data: newProfile, error: createErr } = await admin
        .from('profiles')
        .insert({
          phone: null,
          email: user.email,
          full_name: user.user_metadata?.full_name ?? null,
          avatar_url: user.user_metadata?.avatar_url ?? null,
        })
        .select('id')
        .single()

      if (createErr || !newProfile) {
        console.error('[google-callback] insert error:', createErr)
        return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
      }
      userId = newProfile.id
      isNewUser = true
    }

    const role = existing?.role ?? 'customer'
    const onboardingComplete = existing?.onboarding_complete ?? false

    const token = await signSession(userId, role)
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
