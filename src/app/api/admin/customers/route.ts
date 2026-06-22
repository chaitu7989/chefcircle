import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-server'

function isAdminAuthed(req: NextRequest) {
  const cookie = req.cookies.get('cc_admin')?.value
  return cookie && cookie === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('customer_profiles')
    .select(`
      id, dietary_preferences, created_at,
      profiles!inner(full_name, email, phone, avatar_url, created_at)
    `)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ customers: data })
}
