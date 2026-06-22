'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, ArrowRight, Loader2 } from 'lucide-react'

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '14px 18px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: '#FFFFFF',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box',
}

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      router.push(`/auth/verify?phone=${encodeURIComponent(data.phone)}`)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0B0B0B',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '32px' }}>
            <Image src="/logo.jpg" alt="ChefCircle" width={40} height={40} style={{ borderRadius: '10px' }} />
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF' }}>
              <span style={{ color: '#FF6B35' }}>Chef</span>Circle
            </span>
          </Link>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>
            Enter your mobile number to sign in or create an account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '20px',
          padding: '32px',
        }}>
          <form onSubmit={handleSendOTP}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', marginBottom: '10px', textTransform: 'uppercase' }}>
              Mobile Number
            </label>
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              {/* +91 prefix */}
              <div style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                display: 'flex', alignItems: 'center', gap: '8px',
                fontSize: '15px', color: 'rgba(255,255,255,0.5)', fontWeight: 600,
                pointerEvents: 'none',
              }}>
                <span style={{ fontSize: '16px' }}>🇮🇳</span>
                <span>+91</span>
                <span style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.12)' }} />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="98765 43210"
                required
                maxLength={10}
                style={{ ...INPUT_STYLE, paddingLeft: '100px' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(255,107,53,0.5)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
              />
            </div>

            {error && (
              <p style={{ fontSize: '13px', color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || phone.length !== 10}
              style={{
                width: '100%',
                padding: '14px',
                background: phone.length === 10 ? 'linear-gradient(135deg, #FF6B35, #EA580C)' : 'rgba(255,255,255,0.06)',
                color: phone.length === 10 ? 'white' : 'rgba(255,255,255,0.25)',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '15px',
                cursor: phone.length === 10 && !loading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.15s',
                boxShadow: phone.length === 10 ? '0 4px 18px rgba(255,107,53,0.3)' : 'none',
              }}
            >
              {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Phone size={17} />}
              {loading ? 'Sending OTP…' : 'Send OTP'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.22)', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Social auth — wired later */}
          {[
            { label: 'Continue with Google', icon: '🔵', coming: false },
            { label: 'Continue with Apple', icon: '⚫', coming: true },
          ].map(btn => (
            <button
              key={btn.label}
              disabled={btn.coming}
              style={{
                width: '100%',
                padding: '13px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                color: btn.coming ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: btn.coming ? 'not-allowed' : 'pointer',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <span>{btn.icon}</span>
              {btn.label}
              {btn.coming && <span style={{ fontSize: '10px', background: 'rgba(255,107,53,0.15)', color: '#FF6B35', padding: '2px 8px', borderRadius: '99px', fontWeight: 700 }}>Soon</span>}
            </button>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.2)', marginTop: '24px', lineHeight: 1.7 }}>
          By continuing you agree to our{' '}
          <Link href="#" style={{ color: '#FF6B35', textDecoration: 'none' }}>Terms</Link>
          {' '}and{' '}
          <Link href="#" style={{ color: '#FF6B35', textDecoration: 'none' }}>Privacy Policy</Link>
        </p>

        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )
}
