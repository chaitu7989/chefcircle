import { NextRequest, NextResponse } from 'next/server'
import { verifySession, COOKIE_NAME } from '@/lib/session'
import { getSupabaseAdmin } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ user: null }, { status: 401 })

  const session = await verifySession(token)
  if (!session) return NextResponse.json({ user: null }, { status: 401 })

  const supabase = getSupabaseAdmin()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, phone, full_name, email, avatar_url, role, onboarding_complete, created_at')
    .eq('id', session.userId)
    .single()

  if (!profile) return NextResponse.json({ user: null }, { status: 401 })

  return NextResponse.json({ user: profile })
}
