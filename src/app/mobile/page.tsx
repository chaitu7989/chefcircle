'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

type Tab = 'home' | 'explore' | 'requests' | 'chef' | 'profile'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home',     label: 'Home',    icon: '⌂'  },
  { id: 'explore',  label: 'Explore', icon: '◎'  },
  { id: 'requests', label: 'Requests',icon: '◈'  },
  { id: 'chef',     label: 'Chef',    icon: '✦'  },
  { id: 'profile',  label: 'Profile', icon: '◉'  },
]

function StatusBar() {
  return (
    <div style={{ height: '44px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 22px 8px', fontSize: '12px', fontWeight: 700, color: '#111827' }}>
      <span>9:41</span>
      <div style={{ display: 'flex', gap: '5px', alignItems: 'center', fontSize: '10px' }}>
        <span>●●●</span>
        <span>WiFi</span>
        <span>■</span>
      </div>
    </div>
  )
}

function HomeScreen() {
  return (
    <div style={{ padding: '24px 20px 0', background: '#FFF8F2', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 500, marginBottom: '6px' }}>Good morning 👋</p>
        <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#111827', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: '4px' }}>Find your next home-cooked meal</h1>
      </div>

      {/* Search */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <span style={{ color: '#D1D5DB', fontSize: '14px' }}>⌕</span>
        <span style={{ fontSize: '13px', color: '#D1D5DB' }}>Search dishes, chefs...</span>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
        <div style={{ background: 'linear-gradient(135deg, #FF6B35, #EA580C)', borderRadius: '20px', padding: '22px 18px', color: 'white' }}>
          <div style={{ fontSize: '22px', marginBottom: '10px' }}>◎</div>
          <div style={{ fontSize: '14px', fontWeight: 800, marginBottom: '4px' }}>Explore</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>Find home kitchens</div>
        </div>
        <div style={{ background: '#111827', borderRadius: '20px', padding: '22px 18px', color: 'white' }}>
          <div style={{ fontSize: '22px', marginBottom: '10px' }}>✦</div>
          <div style={{ fontSize: '14px', fontWeight: 800, marginBottom: '4px' }}>Become a Chef</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>Start earning today</div>
        </div>
      </div>

      {/* Community message */}
      <div style={{ background: 'white', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.06)', padding: '24px 20px', marginBottom: '20px' }}>
        <div style={{ width: '36px', height: '4px', background: 'linear-gradient(90deg, #FF6B35, #FBBF24)', borderRadius: '999px', marginBottom: '14px' }} />
        <p style={{ fontSize: '14px', fontWeight: 800, color: '#111827', marginBottom: '8px', lineHeight: 1.3 }}>We&apos;re just getting started.</p>
        <p style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: 1.7 }}>Be among the first to experience ChefCircle in Hyderabad. Help shape the future of home-cooked food.</p>
        <div style={{ marginTop: '16px', display: 'inline-block', background: 'rgba(255,107,53,0.1)', borderRadius: '999px', padding: '6px 14px', fontSize: '11px', fontWeight: 700, color: '#FF6B35' }}>Join Early Access →</div>
      </div>
    </div>
  )
}

function ExploreScreen() {
  return (
    <div style={{ padding: '24px 20px 0', background: 'white', minHeight: '100%' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#111827', letterSpacing: '-0.02em', marginBottom: '20px' }}>Explore</h2>

      {/* Search */}
      <div style={{ background: '#F9FAFB', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.06)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
        <span style={{ color: '#9CA3AF', fontSize: '14px' }}>⌕</span>
        <span style={{ fontSize: '13px', color: '#9CA3AF' }}>Search dishes or chefs...</span>
      </div>

      {/* Category pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '36px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['All', 'Biryani', 'Meals', 'Seafood', 'Sweets'].map((c, i) => (
          <div key={c} style={{ background: i === 0 ? '#111827' : '#F3F4F6', color: i === 0 ? 'white' : '#6B7280', borderRadius: '999px', padding: '8px 18px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>{c}</div>
        ))}
      </div>

      {/* Empty state */}
      <div style={{ textAlign: 'center', padding: '30px 20px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '28px', background: '#FFF8F2', border: '1px solid #FED7AA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px' }}>✦</div>
        <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#111827', marginBottom: '10px', letterSpacing: '-0.01em' }}>No kitchens yet</h3>
        <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.7, marginBottom: '24px' }}>Be part of the first community of home chefs and food lovers in Hyderabad.</p>
        <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #FF6B35, #EA580C)', borderRadius: '999px', padding: '12px 24px', fontSize: '13px', fontWeight: 700, color: 'white', boxShadow: '0 4px 14px rgba(255,107,53,0.3)' }}>Join Early Access</div>
      </div>
    </div>
  )
}

function RequestsScreen() {
  return (
    <div style={{ padding: '24px 20px 0', background: 'white', minHeight: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#111827', letterSpacing: '-0.02em' }}>Community<br />Requests</h2>
        <div style={{ background: '#111827', borderRadius: '14px', padding: '10px 16px', fontSize: '12px', fontWeight: 700, color: 'white' }}>+ Request</div>
      </div>

      <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.7, marginBottom: '32px' }}>Request a dish you&apos;re craving. When enough people want the same dish, a chef prepares it.</p>

      {/* How it works mini */}
      <div style={{ background: '#F6F2ED', borderRadius: '18px', padding: '20px', marginBottom: '28px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#FF6B35', letterSpacing: '0.08em', marginBottom: '14px' }}>HOW REQUESTS WORK</p>
        {[
          { n: '01', t: 'Request a dish you want' },
          { n: '02', t: 'Others vote on the same dish' },
          { n: '03', t: 'Chef accepts when demand is high' },
          { n: '04', t: 'Dish appears on tomorrow\'s menu' },
        ].map(s => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '8px', background: 'rgba(255,107,53,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#FF6B35', flexShrink: 0 }}>{s.n}</div>
            <span style={{ fontSize: '12px', color: '#4B5563' }}>{s.t}</span>
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p style={{ fontSize: '14px', fontWeight: 700, color: '#D1D5DB', marginBottom: '8px' }}>No requests yet</p>
        <p style={{ fontSize: '12px', color: '#9CA3AF' }}>Be the first to request a dish in your area!</p>
      </div>
    </div>
  )
}

function ChefScreen() {
  return (
    <div style={{ padding: '24px 20px 0', background: '#111827', minHeight: '100%', color: 'white' }}>
      {/* Glow */}
      <div style={{ position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '200px', background: 'radial-gradient(ellipse, rgba(255,107,53,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative' }}>
        <div style={{ width: '40px', height: '3px', background: 'linear-gradient(90deg, #FF6B35, #FBBF24)', borderRadius: '999px', marginBottom: '20px' }} />
        <h2 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: '12px' }}>
          Turn your kitchen<br />
          <span style={{ WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', background: 'linear-gradient(90deg, #FF6B35, #FBBF24)' }}>into a business.</span>
        </h2>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: '32px' }}>No restaurant needed. No investment. Just your passion for cooking.</p>

        {/* Benefits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {[
            { icon: '◎', title: 'List your dishes',       desc: 'Add signature recipes with your own pricing' },
            { icon: '◈', title: 'Set your timings',       desc: 'Go online when you are ready to cook'        },
            { icon: '✦', title: 'Earn every meal',        desc: 'Get paid directly for every order received'  },
          ].map(b => (
            <div key={b.title} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,107,53,0.14)', color: '#FF6B35', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{b.icon}</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', marginBottom: '3px' }}>{b.title}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #FF6B35, #EA580C)', borderRadius: '16px', padding: '16px', textAlign: 'center', boxShadow: '0 6px 24px rgba(255,107,53,0.4)' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: 'white', marginBottom: '3px' }}>Register Your Kitchen</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>Free to join · No upfront cost</div>
        </div>
      </div>
    </div>
  )
}

function ProfileScreen() {
  return (
    <div style={{ padding: '24px 20px 0', background: 'white', minHeight: '100%' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#111827', letterSpacing: '-0.02em', marginBottom: '28px' }}>Profile</h2>

      {/* Avatar placeholder */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFF8F2, #FED7AA)', border: '2px solid #FDBA74', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: '28px' }}>◉</div>
        <p style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Welcome to ChefCircle</p>
        <p style={{ fontSize: '12px', color: '#9CA3AF' }}>Sign in to get started</p>
      </div>

      {/* Auth buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
        <div style={{ background: '#111827', borderRadius: '16px', padding: '15px', textAlign: 'center', fontSize: '14px', fontWeight: 700, color: 'white' }}>Sign In</div>
        <div style={{ background: 'white', borderRadius: '16px', padding: '15px', textAlign: 'center', fontSize: '14px', fontWeight: 700, color: '#111827', border: '1px solid rgba(0,0,0,0.1)' }}>Create Account</div>
      </div>

      {/* Why join */}
      <div style={{ background: '#FFF8F2', borderRadius: '20px', padding: '20px', border: '1px solid #FED7AA' }}>
        <p style={{ fontSize: '12px', fontWeight: 700, color: '#FF6B35', letterSpacing: '0.08em', marginBottom: '14px' }}>WHY JOIN</p>
        {[
          'Order from home chefs nearby',
          'Become a chef and earn from home',
          'Request dishes from your community',
          'Be part of a movement',
        ].map(item => (
          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF6B35', flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: '#4B5563', lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const SCREENS: Record<Tab, React.ReactNode> = {
  home:     <HomeScreen />,
  explore:  <ExploreScreen />,
  requests: <RequestsScreen />,
  chef:     <ChefScreen />,
  profile:  <ProfileScreen />,
}

export default function MobilePreviewPage() {
  const [active, setActive] = useState<Tab>('home')

  return (
    <div style={{ background: '#0D0D12', minHeight: '100vh', padding: '80px 24px 100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        style={{ textAlign: 'center', marginBottom: '64px' }}
      >
        <span style={{ display: 'inline-block', background: 'rgba(255,107,53,0.12)', border: '1px solid rgba(255,107,53,0.25)', color: '#FF6B35', borderRadius: '999px', padding: '6px 18px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '20px' }}>
          MOBILE APP · COMING SOON
        </span>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'white', letterSpacing: '-0.03em', marginBottom: '14px' }}>
          ChefCircle on Mobile
        </h1>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)', maxWidth: '480px', lineHeight: 1.8 }}>
          The full ChefCircle experience — explore kitchens, request dishes, and manage your kitchen — all from your phone.
        </p>
      </motion.div>

      {/* Tab selector — outside the phone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        style={{ display: 'flex', gap: '8px', marginBottom: '40px', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            style={{
              padding: '10px 22px',
              borderRadius: '999px',
              border: '1px solid',
              borderColor: active === tab.id ? '#FF6B35' : 'rgba(255,255,255,0.1)',
              background: active === tab.id ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.04)',
              color: active === tab.id ? '#FF6B35' : 'rgba(255,255,255,0.4)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Phone frame */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        style={{
          width: '375px',
          height: '812px',
          borderRadius: '56px',
          border: '12px solid #1C1C1E',
          background: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 0 0 2px #2C2C2E, 0 60px 140px rgba(0,0,0,0.7)',
          flexShrink: 0,
        }}
      >
        {/* Dynamic island / notch */}
        <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', width: '120px', height: '34px', background: '#000', borderRadius: '999px', zIndex: 30 }} />

        {/* Status bar */}
        <StatusBar />

        {/* Scrollable screen content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            style={{ height: 'calc(100% - 44px - 72px)', overflowY: 'auto', position: 'relative' }}
          >
            {SCREENS[active]}
          </motion.div>
        </AnimatePresence>

        {/* Bottom tab bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '72px', background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', paddingBottom: '8px' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 6px', minWidth: '52px' }}
            >
              <span style={{ fontSize: '18px', color: active === tab.id ? '#FF6B35' : '#9CA3AF', lineHeight: 1 }}>{tab.icon}</span>
              <span style={{ fontSize: '9px', fontWeight: 700, color: active === tab.id ? '#FF6B35' : '#9CA3AF', letterSpacing: '0.02em' }}>{tab.label}</span>
              {active === tab.id && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#FF6B35', marginTop: '1px' }} />}
            </button>
          ))}
        </div>
      </motion.div>

      {/* CTA below phone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        style={{ marginTop: '56px', textAlign: 'center' }}
      >
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>Built with React Native · Shared design language with the web</p>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 30px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>
          ← Back to Website
        </Link>
      </motion.div>
    </div>
  )
}
