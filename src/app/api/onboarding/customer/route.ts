import { NextRequest, NextResponse } from 'next/server'
import { verifySession, signSession, COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/session'
import { getSupabaseAdmin } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const session = await verifySession(token)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { full_name, email, dietary_preferences } = await req.json()
  if (!full_name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

  const supabase = getSupabaseAdmin()

  const profileUpdate: Record<string, unknown> = {
    full_name: full_name.trim(),
    role: 'customer',
    onboarding_complete: true,
  }
  if (email?.trim()) profileUpdate.email = email.trim()

  const { error: profileErr } = await supabase
    .from('profiles')
    .update(profileUpdate)
    .eq('id', session.userId)

  if (profileErr) return NextResponse.json({ error: profileErr.message }, { status: 500 })

  await supabase
    .from('customer_profiles')
    .upsert({ id: session.userId, dietary_preferences: dietary_preferences || [] })

  // Re-issue token with role
  const newToken = await signSession(session.userId, 'customer')
  const res = NextResponse.json({ success: true })
  res.cookies.set(COOKIE_NAME, newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
  return res
}
