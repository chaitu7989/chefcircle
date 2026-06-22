import { NextRequest, NextResponse } from 'next/server'
import { verifySession, signSession, COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/session'
import { getSupabaseAdmin } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const session = await verifySession(token)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { full_name, email, kitchen_name, about, cuisine_types, years_experience, cooking_address, service_radius, available_timings } = body

  if (!full_name?.trim() || !kitchen_name?.trim()) {
    return NextResponse.json({ error: 'Name and kitchen name are required' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()

  const profileUpdate: Record<string, unknown> = {
    full_name: full_name.trim(),
    role: 'chef',
    onboarding_complete: true,
  }
  if (email?.trim()) profileUpdate.email = email.trim()

  const { error: profileErr } = await supabase
    .from('profiles')
    .update(profileUpdate)
    .eq('id', session.userId)

  if (profileErr) return NextResponse.json({ error: profileErr.message }, { status: 500 })

  const { error: chefErr } = await supabase
    .from('chef_profiles')
    .upsert({
      id: session.userId,
      kitchen_name: kitchen_name.trim(),
      about: about?.trim() || null,
      cuisine_types: cuisine_types || [],
      years_experience: years_experience ? Number(years_experience) : null,
      cooking_address: cooking_address?.trim() || null,
      service_radius: service_radius ? Number(service_radius) : 5,
      available_timings: available_timings || {},
      verification_status: 'pending',
    })

  if (chefErr) return NextResponse.json({ error: chefErr.message }, { status: 500 })

  const newToken = await signSession(session.userId, 'chef')
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
