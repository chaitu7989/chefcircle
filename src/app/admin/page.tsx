'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Stats = { totalChefs: number; pendingChefs: number; approvedChefs: number; totalCustomers: number; totalUsers: number }
type Chef = {
  id: string; kitchen_name: string; about: string; cuisine_types: string[]
  years_experience: number; cooking_address: string; service_radius: number
  verification_status: string; created_at: string
  profiles: { full_name: string; email: string; phone: string }
}
type Customer = {
  id: string; dietary_preferences: string[]; created_at: string
  profiles: { full_name: string; email: string; phone: string }
}

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  pending:  { bg: 'rgba(251,191,36,0.1)',  color: '#FBBF24', label: 'Pending'  },
  approved: { bg: 'rgba(52,211,153,0.1)',  color: '#34D399', label: 'Approved' },
  rejected: { bg: 'rgba(248,113,113,0.1)', color: '#F87171', label: 'Rejected' },
}

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<'overview' | 'chefs' | 'customers'>('overview')
  const [stats, setStats] = useState<Stats | null>(null)
  const [chefs, setChefs] = useState<Chef[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [updating, setUpdating] = useState<string | null>(null)

  async function checkAuth() {
    const res = await fetch('/api/admin/stats')
    if (res.status === 401) { router.replace('/admin/login'); return }
    setStats(await res.json())
  }

  async function loadChefs() {
    const res = await fetch('/api/admin/chefs')
    if (res.ok) setChefs((await res.json()).chefs ?? [])
  }

  async function loadCustomers() {
    const res = await fetch('/api/admin/customers')
    if (res.ok) setCustomers((await res.json()).customers ?? [])
  }

  useEffect(() => { checkAuth() }, [])
  useEffect(() => {
    if (tab === 'chefs') loadChefs()
    if (tab === 'customers') loadCustomers()
  }, [tab])

  async function updateChefStatus(chefId: string, status: string) {
    setUpdating(chefId)
    await fetch('/api/admin/chefs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chefId, status }),
    })
    await Promise.all([loadChefs(), checkAuth()])
    setUpdating(null)
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/login')
  }

  const StatCard = ({ label, value, sub, color }: { label: string; value: number; sub?: string; color: string }) => (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px', flex: 1, minWidth: '160px' }}>
      <div style={{ fontSize: '36px', fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '4px', fontWeight: 600 }}>{label}</div>
      {sub && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{sub}</div>}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px', fontWeight: 900 }}>
            <span style={{ color: '#FF6B35' }}>Chef</span><span>Circle</span>
          </span>
          <span style={{ background: 'rgba(255,107,53,0.12)', color: '#FF6B35', fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', letterSpacing: '0.06em' }}>ADMIN PANEL</span>
        </div>
        <button onClick={handleLogout} style={{ background: 'rgba(248,113,113,0.1)', color: '#F87171', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
          Sign Out
        </button>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '4px', marginBottom: '32px', width: 'fit-content' }}>
          {(['overview', 'chefs', 'customers'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '9px 22px', borderRadius: '9px', border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: '13px', textTransform: 'capitalize',
              background: tab === t ? '#FF6B35' : 'transparent',
              color: tab === t ? '#fff' : 'rgba(255,255,255,0.45)',
              transition: 'all 0.15s',
            }}>{t}</button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '6px' }}>Platform Overview</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginBottom: '28px' }}>Real-time stats across ChefCircle</p>
            {stats ? (
              <>
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '28px' }}>
                  <StatCard label="Total Users" value={stats.totalUsers} color="#FF6B35" />
                  <StatCard label="Total Chefs" value={stats.totalChefs} color="#A78BFA" />
                  <StatCard label="Pending Approval" value={stats.pendingChefs} sub="needs your review" color="#FBBF24" />
                  <StatCard label="Approved Chefs" value={stats.approvedChefs} color="#34D399" />
                  <StatCard label="Customers" value={stats.totalCustomers} color="#60A5FA" />
                </div>
                {stats.pendingChefs > 0 && (
                  <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '14px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#FBBF24', marginBottom: '4px' }}>⚠ {stats.pendingChefs} chef{stats.pendingChefs > 1 ? 's' : ''} waiting for approval</div>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>Review their details and approve or reject to let them go live</div>
                    </div>
                    <button onClick={() => setTab('chefs')} style={{ background: '#FBBF24', color: '#000', border: 'none', borderRadius: '9px', padding: '10px 20px', fontWeight: 800, fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      Review Chefs →
                    </button>
                  </div>
                )}
                {stats.pendingChefs === 0 && stats.totalChefs > 0 && (
                  <div style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: '14px', padding: '20px 24px' }}>
                    <div style={{ fontWeight: 700, color: '#34D399' }}>✓ All chefs have been reviewed</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>No pending approvals</div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>Loading…</div>
            )}
          </div>
        )}

        {/* CHEFS */}
        {tab === 'chefs' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '6px' }}>Registered Chefs</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginBottom: '24px' }}>Approve or reject chefs to control who appears on the platform</p>
            {chefs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(255,255,255,0.25)', fontSize: '15px' }}>No chefs registered yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {chefs.map(chef => {
                  const sc = STATUS_COLORS[chef.verification_status] ?? STATUS_COLORS.pending
                  return (
                    <div key={chef.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '22px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 800, fontSize: '16px' }}>{chef.profiles?.full_name ?? '—'}</span>
                            <span style={{ background: sc.bg, color: sc.color, fontSize: '10px', fontWeight: 800, padding: '3px 10px', borderRadius: '99px', letterSpacing: '0.04em', border: `1px solid ${sc.color}25` }}>{sc.label.toUpperCase()}</span>
                          </div>
                          <div style={{ fontSize: '14px', color: '#FF6B35', fontWeight: 700, marginBottom: '10px' }}>🍳 {chef.kitchen_name}</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                            {chef.profiles?.email && <span>✉ {chef.profiles.email}</span>}
                            {chef.profiles?.phone && <span>📱 {chef.profiles.phone}</span>}
                            {chef.cooking_address && <span>📍 {chef.cooking_address}</span>}
                            {chef.service_radius && <span>🔄 {chef.service_radius} km</span>}
                            {chef.years_experience && <span>⭐ {chef.years_experience} yrs exp</span>}
                          </div>
                          {chef.cuisine_types?.length > 0 && (
                            <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                              {chef.cuisine_types.map(c => (
                                <span key={c} style={{ background: 'rgba(255,107,53,0.08)', color: 'rgba(255,107,53,0.8)', fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '99px', border: '1px solid rgba(255,107,53,0.15)' }}>{c}</span>
                              ))}
                            </div>
                          )}
                          {chef.about && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '10px', maxWidth: '520px', lineHeight: 1.6 }}>{chef.about}</div>}
                          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '10px' }}>
                            Registered {new Date(chef.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {chef.verification_status !== 'approved' && (
                            <button onClick={() => updateChefStatus(chef.id, 'approved')} disabled={updating === chef.id}
                              style={{ background: 'rgba(52,211,153,0.12)', color: '#34D399', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '9px', padding: '10px 20px', fontWeight: 800, fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                              {updating === chef.id ? '…' : '✓ Approve'}
                            </button>
                          )}
                          {chef.verification_status !== 'rejected' && (
                            <button onClick={() => updateChefStatus(chef.id, 'rejected')} disabled={updating === chef.id}
                              style={{ background: 'rgba(248,113,113,0.1)', color: '#F87171', border: '1px solid rgba(248,113,113,0.25)', borderRadius: '9px', padding: '10px 20px', fontWeight: 800, fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                              {updating === chef.id ? '…' : '✕ Reject'}
                            </button>
                          )}
                          {chef.verification_status !== 'pending' && (
                            <button onClick={() => updateChefStatus(chef.id, 'pending')} disabled={updating === chef.id}
                              style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '9px', padding: '10px 20px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                              Reset to Pending
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* CUSTOMERS */}
        {tab === 'customers' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '6px' }}>Registered Customers</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginBottom: '24px' }}>{customers.length} customer{customers.length !== 1 ? 's' : ''} on the platform</p>
            {customers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(255,255,255,0.25)', fontSize: '15px' }}>No customers yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {customers.map(c => (
                  <div key={c.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(96,165,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '15px', color: '#60A5FA', flexShrink: 0 }}>
                        {(c.profiles?.full_name?.[0] ?? '?').toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '15px' }}>{c.profiles?.full_name ?? '—'}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{c.profiles?.email ?? c.profiles?.phone ?? '—'}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      {c.dietary_preferences?.length > 0 && (
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                          {c.dietary_preferences.map(d => (
                            <span key={d} style={{ background: 'rgba(96,165,250,0.08)', color: '#60A5FA', fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '99px', border: '1px solid rgba(96,165,250,0.15)' }}>{d}</span>
                          ))}
                        </div>
                      )}
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.22)', whiteSpace: 'nowrap' }}>
                        Joined {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
