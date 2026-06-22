import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { generateOTP, sendOTPSMS, normalizePhone } from '@/lib/otp'

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json()
    if (!phone) return NextResponse.json({ error: 'Phone number required' }, { status: 400 })

    const normalized = normalizePhone(phone)
    if (normalized.length !== 10) {
      return NextResponse.json({ error: 'Enter a valid 10-digit Indian mobile number' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Rate-limit: max 3 OTPs per phone per 10 minutes
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
    const { count } = await supabase
      .from('otp_verifications')
      .select('*', { count: 'exact', head: true })
      .eq('phone', normalized)
      .gte('created_at', tenMinAgo)

    if ((count ?? 0) >= 3) {
      return NextResponse.json({ error: 'Too many OTP requests. Please wait 10 minutes.' }, { status: 429 })
    }

    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

    const { error: dbErr } = await supabase
      .from('otp_verifications')
      .insert({ phone: normalized, otp, expires_at: expiresAt })

    if (dbErr) throw dbErr

    const { success, error: smsErr } = await sendOTPSMS(normalized, otp)
    if (!success) {
      return NextResponse.json({ error: smsErr || 'Failed to send OTP' }, { status: 500 })
    }

    return NextResponse.json({ success: true, phone: normalized })
  } catch (err) {
    console.error('[send-otp]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
