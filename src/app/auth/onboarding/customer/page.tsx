'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { User, Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

const DIETARY = ['Vegetarian', 'Vegan', 'Jain', 'Gluten-Free', 'Dairy-Free', 'Non-Veg', 'Halal', 'Keto']

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '13px 16px 13px 44px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '12px',
  color: '#FFFFFF',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
}

export default function CustomerOnboardingPage() {
  const router = useRouter()
  const [form, setForm] = useState({ full_name: '', email: '' })
  const [dietary, setDietary] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggle = (pref: string) =>
    setDietary(p => p.includes(pref) ? p.filter(x => x !== pref) : [...p, pref])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.full_name.trim()) { setError('Please enter your name'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/onboarding/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, dietary_preferences: dietary }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      router.push('/customer/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B0B0B', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE }}>

          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '28px' }}>
              <Image src="/logo.jpg" alt="ChefCircle" width={36} height={36} style={{ borderRadius: '9px' }} />
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF' }}>
                <span style={{ color: '#FF6B35' }}>Chef</span>Circle
              </span>
            </Link>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              Tell us about yourself
            </h1>
            <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.35)' }}>
              Quick setup — takes less than 60 seconds
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '28px' }}>
            <form onSubmit={handleSubmit}>

              {/* Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)' }} />
                  <input
                    type="text"
                    placeholder="Your name"
                    value={form.full_name}
                    onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                    required
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = 'rgba(255,107,53,0.4)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)' }}
                  />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Email <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 500, fontSize: '10px' }}>(optional)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)' }} />
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = 'rgba(255,107,53,0.4)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)' }}
                  />
                </div>
              </div>

              {/* Dietary preferences */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Dietary Preferences <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 500, fontSize: '10px' }}>(optional)</span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {DIETARY.map(pref => {
                    const selected = dietary.includes(pref)
                    return (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => toggle(pref)}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '99px',
                          border: `1px solid ${selected ? '#FF6B35' : 'rgba(255,255,255,0.1)'}`,
                          background: selected ? 'rgba(255,107,53,0.12)' : 'transparent',
                          color: selected ? '#FF6B35' : 'rgba(255,255,255,0.45)',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          transition: 'all 0.15s',
                        }}
                      >
                        {selected && <CheckCircle2 size={12} />}
                        {pref}
                      </button>
                    )
                  })}
                </div>
              </div>

              {error && (
                <p style={{ fontSize: '13px', color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px' }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #FF6B35, #EA580C)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 18px rgba(255,107,53,0.3)',
                }}
              >
                {loading ? <Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} /> : <ArrowRight size={17} />}
                {loading ? 'Setting up…' : 'Start Exploring'}
              </button>

            </form>
          </div>

        </motion.div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )
}
