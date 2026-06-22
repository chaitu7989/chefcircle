'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Bell, Heart, ShoppingBag, Settings, LogOut, ChefHat, MapPin, Star, Loader2, User } from 'lucide-react'

type Profile = { id: string; full_name: string | null; phone: string; email: string | null; avatar_url: string | null }

export default function CustomerDashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'home' | 'saved' | 'orders' | 'settings'>('home')

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => setProfile(d.user))
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

  const TABS = [
    { key: 'home', icon: <Search size={18} />, label: 'Explore' },
    { key: 'saved', icon: <Heart size={18} />, label: 'Saved' },
    { key: 'orders', icon: <ShoppingBag size={18} />, label: 'Orders' },
    { key: 'settings', icon: <Settings size={18} />, label: 'Settings' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0B0B0B', color: '#FFFFFF', paddingBottom: '80px' }}>

      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 20px', position: 'sticky', top: 64, zIndex: 20 }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '2px' }}>Hello 👋</p>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
              {profile?.full_name ?? 'Guest'}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}>
              <Bell size={16} />
            </button>
            <button
              onClick={handleLogout}
              style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 20px' }}>

        {/* Tab: Explore */}
        {activeTab === 'home' && (
          <div>
            {/* Search bar */}
            <div style={{ position: 'relative', marginBottom: '28px' }}>
              <Search size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)' }} />
              <input
                type="text"
                placeholder="Search home-cooked dishes…"
                style={{ width: '100%', padding: '13px 16px 13px 42px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#FFFFFF', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Empty state */}
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#FF6B35' }}>
                <ChefHat size={30} />
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px', letterSpacing: '-0.01em' }}>
                No chefs in your area yet
              </h2>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.8, maxWidth: '300px', margin: '0 auto 28px' }}>
                Be the first to spread the word! Invite home chefs in your neighbourhood to join ChefCircle.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/auth/onboarding/chef"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '11px 22px', background: 'linear-gradient(135deg, #FF6B35, #EA580C)', color: 'white', borderRadius: '10px', fontWeight: 700, fontSize: '13.5px', textDecoration: 'none', boxShadow: '0 4px 14px rgba(255,107,53,0.3)' }}>
                  <ChefHat size={15} /> Become a Chef
                </Link>
                <Link href="/"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '11px 22px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', fontWeight: 700, fontSize: '13.5px', textDecoration: 'none' }}>
                  <MapPin size={15} /> Learn More
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Saved */}
        {activeTab === 'saved' && (
          <EmptyState icon={<Heart size={28} />} title="No saved dishes yet" desc='Tap the ♡ on any dish to save it for later.' />
        )}

        {/* Tab: Orders */}
        {activeTab === 'orders' && (
          <EmptyState icon={<ShoppingBag size={28} />} title="No orders yet" desc="Your order history will appear here once you place your first order." />
        )}

        {/* Tab: Settings */}
        {activeTab === 'settings' && (
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '20px' }}>Account</h2>

            {/* Profile summary */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(255,107,53,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF6B35', flexShrink: 0 }}>
                <User size={22} />
              </div>
              <div>
                <p style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '3px' }}>{profile?.full_name ?? 'Set your name'}</p>
                <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.3)' }}>+91 {profile?.phone}</p>
                {profile?.email && <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>{profile.email}</p>}
              </div>
            </div>

            {[
              { label: 'Edit Profile', icon: <User size={15} /> },
              { label: 'Notifications', icon: <Bell size={15} /> },
            ].map(item => (
              <div key={item.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '15px 18px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>{item.icon}</span>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{item.label}</span>
              </div>
            ))}

            <button
              onClick={handleLogout}
              style={{ width: '100%', marginTop: '12px', padding: '14px', background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: '12px', color: '#f87171', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Bottom tab bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(11,11,11,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', zIndex: 50 }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            style={{ flex: 1, padding: '12px 8px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: activeTab === tab.key ? '#FF6B35' : 'rgba(255,255,255,0.25)', transition: 'color 0.15s' }}
          >
            {tab.icon}
            <span style={{ fontSize: '10px', fontWeight: 700 }}>{tab.label}</span>
          </button>
        ))}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

function EmptyState({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(255,107,53,0.07)', border: '1px solid rgba(255,107,53,0.13)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: '#FF6B35' }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>{title}</h3>
      <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.28)', lineHeight: 1.75, maxWidth: '260px', margin: '0 auto' }}>{desc}</p>
    </div>
  )
}
