import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-server'

function isAdminAuthed(req: NextRequest) {
  const cookie = req.cookies.get('cc_admin')?.value
  return cookie && cookie === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = getSupabaseAdmin()

  const [
    { count: totalChefs },
    { count: pendingChefs },
    { count: approvedChefs },
    { count: totalCustomers },
  ] = await Promise.all([
    supabase.from('chef_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('chef_profiles').select('*', { count: 'exact', head: true }).eq('verification_status', 'pending'),
    supabase.from('chef_profiles').select('*', { count: 'exact', head: true }).eq('verification_status', 'approved'),
    supabase.from('customer_profiles').select('*', { count: 'exact', head: true }),
  ])

  return NextResponse.json({
    totalChefs: totalChefs ?? 0,
    pendingChefs: pendingChefs ?? 0,
    approvedChefs: approvedChefs ?? 0,
    totalCustomers: totalCustomers ?? 0,
    totalUsers: (totalChefs ?? 0) + (totalCustomers ?? 0),
  })
}
