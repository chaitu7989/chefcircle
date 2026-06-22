import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { signSession, COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/session'
import { normalizePhone } from '@/lib/otp'

export async function POST(req: NextRequest) {
  try {
    const { phone, otp } = await req.json()
    if (!phone || !otp) return NextResponse.json({ error: 'Phone and OTP required' }, { status: 400 })

    const normalized = normalizePhone(phone)
    const supabase = getSupabaseAdmin()

    // Find most recent unverified OTP for this phone
    const { data: record, error: fetchErr } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('phone', normalized)
      .eq('verified', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (fetchErr || !record) {
      return NextResponse.json({ error: 'OTP not found or already used' }, { status: 400 })
    }

    // Check expiry
    if (new Date() > new Date(record.expires_at)) {
      return NextResponse.json({ error: 'OTP expired. Please request a new one.' }, { status: 400 })
    }

    // Max 5 attempts
    if (record.attempts >= 5) {
      return NextResponse.json({ error: 'Too many attempts. Request a new OTP.' }, { status: 400 })
    }

    // Increment attempts regardless
    await supabase
      .from('otp_verifications')
      .update({ attempts: record.attempts + 1 })
      .eq('id', record.id)

    if (record.otp !== otp) {
      return NextResponse.json({ error: 'Incorrect OTP. Please try again.' }, { status: 400 })
    }

    // Mark as verified
    await supabase
      .from('otp_verifications')
      .update({ verified: true })
      .eq('id', record.id)

    // Check if user exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role, onboarding_complete')
      .eq('phone', normalized)
      .single()

    let userId: string
    let isNewUser = false

    if (profile) {
      userId = profile.id
    } else {
      // Create new profile
      const { data: newProfile, error: createErr } = await supabase
        .from('profiles')
        .insert({ phone: normalized })
        .select('id')
        .single()
      if (createErr || !newProfile) throw createErr
      userId = newProfile.id
      isNewUser = true
    }

    // Issue session cookie
    const token = await signSession(userId, profile?.role ?? 'customer')
    const res = NextResponse.json({
      success: true,
      isNewUser,
      role: profile?.role ?? null,
      onboardingComplete: profile?.onboarding_complete ?? false,
    })

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    })

    return res
  } catch (err) {
    console.error('[verify-otp]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
