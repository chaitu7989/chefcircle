'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Power, Package, TrendingUp, Bell, Plus, ChefHat, Settings, LogOut, UtensilsCrossed, Loader2, User, MessageSquare, Clock } from 'lucide-react'

type Profile = { id: string; full_name: string | null; phone: string; email: string | null }
type ChefData = { kitchen_name: string | null; about: string | null; verification_status: string; cuisine_types: string[] }

export default function ChefDashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [chefData, setChefData] = useState<ChefData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'dishes' | 'orders' | 'requests' | 'settings'>('overview')

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(async d => {
        setProfile(d.user)
        // Fetch chef-specific data
        const { createClient } = await import('@supabase/supabase-js')
        const sb = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        const { data: cp } = await sb.from('chef_profiles').select('*').eq('id', d.user.id).single()
        if (cp) setChefData(cp)
      })
      .catch(() => router.push('/auth/login'))
      .finally(() => setLoading(false))
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0B0B0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={24} color="#FF6B35" style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  const isVerified = chefData?.verification_status === 'verified'

  const TABS = [
    { key: 'overview', icon: <TrendingUp size={17} />, label: 'Overview' },
    { key: 'dishes', icon: <UtensilsCrossed size={17} />, label: 'Dishes' },
    { key: 'orders', icon: <Package size={17} />, label: 'Orders' },
    { key: 'requests', icon: <MessageSquare size={17} />, label: 'Requests' },
    { key: 'settings', icon: <Settings size={17} />, label: 'Settings' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0B0B0B', color: '#FFFFFF', paddingBottom: '80px' }}>

      {/* Top header */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 20px', position: 'sticky', top: 64, zIndex: 20 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.28)', marginBottom: '2px' }}>Chef Dashboard</p>
            <h1 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>
              {chefData?.kitchen_name ?? profile?.full_name ?? 'My Kitchen'}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Online toggle */}
            <button
              onClick={() => setIsOnline(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '8px 14px',
                background: isOnline ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${isOnline ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: '10px',
                color: isOnline ? '#22c55e' : 'rgba(255,255,255,0.35)',
                fontWeight: 700, fontSize: '12px', cursor: 'pointer',
              }}
            >
              <Power size={13} />
              {isOnline ? 'Online' : 'Offline'}
            </button>
            <button
              onClick={handleLogout}
              style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 20px' }}>

        {/* Verification banner */}
        {!isVerified && (
          <div style={{ background: 'rgba(255,107,53,0.07)', border: '1px solid rgba(255,107,53,0.18)', borderRadius: '14px', padding: '14px 18px', marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <Clock size={16} color="#FF6B35" style={{ flexShrink: 0, marginTop: '1px' }} />
            <div>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#FF6B35', marginBottom: '3px' }}>Kitchen Pending Verification</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,107,53,0.7)', lineHeight: 1.6 }}>
                Your kitchen is under review. You can still add dishes and prepare. We'll notify you once approved.
              </p>
            </div>
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '28px' }}>
              {[
                { label: "Today's Earnings", value: '₹0', icon: <TrendingUp size={17} />, color: '#22c55e' },
                { label: 'Pending Orders', value: '0', icon: <Package size={17} />, color: '#FF6B35' },
                { label: 'Active Dishes', value: '0', icon: <UtensilsCrossed size={17} />, color: '#FF6B35' },
                { label: 'Dish Requests', value: '0', icon: <Bell size={17} />, color: '#FBBF24' },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '16px' }}>
                  <div style={{ color: s.color, marginBottom: '10px' }}>{s.icon}</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '3px' }}>{s.value}</div>
                  <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.28)', fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '12px' }}>Quick Actions</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '28px' }}>
              {[
                { label: 'Add a Dish', icon: <Plus size={18} />, onClick: () => setActiveTab('dishes'), primary: true },
                { label: 'View Orders', icon: <Package size={18} />, onClick: () => setActiveTab('orders'), primary: false },
              ].map(btn => (
                <button key={btn.label} onClick={btn.onClick}
                  style={{ padding: '16px', background: btn.primary ? 'rgba(255,107,53,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${btn.primary ? 'rgba(255,107,53,0.2)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '14px', color: btn.primary ? '#FF6B35' : 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {btn.icon} {btn.label}
                </button>
              ))}
            </div>

            {/* Kitchen info */}
            {chefData && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '18px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '12px' }}>Kitchen Info</p>
                {chefData.about && <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: '12px' }}>{chefData.about}</p>}
                {chefData.cuisine_types.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                    {chefData.cuisine_types.map(c => (
                      <span key={c} style={{ padding: '4px 12px', background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.15)', borderRadius: '99px', fontSize: '12px', color: '#FF6B35', fontWeight: 600 }}>{c}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* DISHES TAB */}
        {activeTab === 'dishes' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF' }}>My Dishes</h2>
              <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: 'linear-gradient(135deg, #FF6B35, #EA580C)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                <Plus size={14} /> Add Dish
              </button>
            </div>
            <EmptyState icon={<UtensilsCrossed size={26} />} title="No dishes yet" desc='Add your first dish and start taking orders from your community.' cta={{ label: 'Add First Dish', onClick: () => {} }} />
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <EmptyState icon={<Package size={26} />} title="No orders yet" desc='Once customers order from you, they will appear here in real time.' />
        )}

        {/* REQUESTS TAB */}
        {activeTab === 'requests' && (
          <EmptyState icon={<MessageSquare size={26} />} title="No dish requests yet" desc='When customers in your area request a dish, you will see it here and can prepare it in bulk.' />
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '20px' }}>Account</h2>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(255,107,53,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF6B35', flexShrink: 0 }}>
                <ChefHat size={22} />
              </div>
              <div>
                <p style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '3px' }}>{profile?.full_name ?? 'Chef'}</p>
                <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.3)' }}>+91 {profile?.phone}</p>
                <span style={{ fontSize: '11px', fontWeight: 700, color: isVerified ? '#22c55e' : '#FF6B35', background: isVerified ? 'rgba(34,197,94,0.1)' : 'rgba(255,107,53,0.08)', padding: '2px 8px', borderRadius: '99px', display: 'inline-block', marginTop: '4px' }}>
                  {isVerified ? '✓ Verified' : '⏳ Pending Verification'}
                </span>
              </div>
            </div>
            {[
              { label: 'Edit Kitchen Profile', icon: <User size={15} /> },
              { label: 'Kitchen Photos', icon: <ChefHat size={15} /> },
              { label: 'Notifications', icon: <Bell size={15} /> },
            ].map(item => (
              <div key={item.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '15px 18px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>{item.icon}</span>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{item.label}</span>
              </div>
            ))}
            <button onClick={handleLogout}
              style={{ width: '100%', marginTop: '12px', padding: '14px', background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: '12px', color: '#f87171', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Bottom tab bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(11,11,11,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', zIndex: 50 }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)}
            style={{ flex: 1, padding: '12px 6px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: activeTab === tab.key ? '#FF6B35' : 'rgba(255,255,255,0.22)', transition: 'color 0.15s' }}>
            {tab.icon}
            <span style={{ fontSize: '9.5px', fontWeight: 700 }}>{tab.label}</span>
          </button>
        ))}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

function EmptyState({ icon, title, desc, cta }: { icon: React.ReactNode; title: string; desc: string; cta?: { label: string; onClick: () => void } }) {
  return (
    <div style={{ textAlign: 'center', padding: '56px 20px' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(255,107,53,0.07)', border: '1px solid rgba(255,107,53,0.13)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: '#FF6B35' }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>{title}</h3>
      <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.28)', lineHeight: 1.75, maxWidth: '260px', margin: '0 auto 20px' }}>{desc}</p>
      {cta && (
        <button onClick={cta.onClick}
          style={{ padding: '10px 22px', background: 'linear-gradient(135deg, #FF6B35, #EA580C)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 700, fontSize: '13.5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
          <Plus size={14} /> {cta.label}
        </button>
      )}
    </div>
  )
}
