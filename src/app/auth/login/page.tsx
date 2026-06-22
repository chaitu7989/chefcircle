'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Loader2, ChevronDown, Phone } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

// ── Country list ─────────────────────────────────────────────
const COUNTRIES = [
  { code: 'IN', name: 'India',               dial: '+91',  len: 10 },
  { code: 'US', name: 'United States',       dial: '+1',   len: 10 },
  { code: 'GB', name: 'United Kingdom',      dial: '+44',  len: 10 },
  { code: 'AE', name: 'UAE',                 dial: '+971', len: 9  },
  { code: 'SG', name: 'Singapore',           dial: '+65',  len: 8  },
  { code: 'AU', name: 'Australia',           dial: '+61',  len: 9  },
  { code: 'CA', name: 'Canada',              dial: '+1',   len: 10 },
  { code: 'MY', name: 'Malaysia',            dial: '+60',  len: 9  },
  { code: 'QA', name: 'Qatar',               dial: '+974', len: 8  },
  { code: 'SA', name: 'Saudi Arabia',        dial: '+966', len: 9  },
  { code: 'KW', name: 'Kuwait',              dial: '+965', len: 8  },
  { code: 'BH', name: 'Bahrain',             dial: '+973', len: 8  },
  { code: 'OM', name: 'Oman',                dial: '+968', len: 8  },
  { code: 'NZ', name: 'New Zealand',         dial: '+64',  len: 9  },
  { code: 'DE', name: 'Germany',             dial: '+49',  len: 10 },
  { code: 'FR', name: 'France',              dial: '+33',  len: 9  },
  { code: 'IT', name: 'Italy',               dial: '+39',  len: 10 },
  { code: 'ES', name: 'Spain',               dial: '+34',  len: 9  },
  { code: 'NL', name: 'Netherlands',         dial: '+31',  len: 9  },
  { code: 'SE', name: 'Sweden',              dial: '+46',  len: 9  },
  { code: 'NO', name: 'Norway',              dial: '+47',  len: 8  },
  { code: 'DK', name: 'Denmark',             dial: '+45',  len: 8  },
  { code: 'CH', name: 'Switzerland',         dial: '+41',  len: 9  },
  { code: 'BE', name: 'Belgium',             dial: '+32',  len: 9  },
  { code: 'AT', name: 'Austria',             dial: '+43',  len: 10 },
  { code: 'PL', name: 'Poland',              dial: '+48',  len: 9  },
  { code: 'PT', name: 'Portugal',            dial: '+351', len: 9  },
  { code: 'JP', name: 'Japan',               dial: '+81',  len: 10 },
  { code: 'KR', name: 'South Korea',         dial: '+82',  len: 10 },
  { code: 'CN', name: 'China',               dial: '+86',  len: 11 },
  { code: 'HK', name: 'Hong Kong',           dial: '+852', len: 8  },
  { code: 'TW', name: 'Taiwan',              dial: '+886', len: 9  },
  { code: 'TH', name: 'Thailand',            dial: '+66',  len: 9  },
  { code: 'ID', name: 'Indonesia',           dial: '+62',  len: 10 },
  { code: 'PH', name: 'Philippines',         dial: '+63',  len: 10 },
  { code: 'VN', name: 'Vietnam',             dial: '+84',  len: 9  },
  { code: 'BD', name: 'Bangladesh',          dial: '+880', len: 10 },
  { code: 'PK', name: 'Pakistan',            dial: '+92',  len: 10 },
  { code: 'LK', name: 'Sri Lanka',           dial: '+94',  len: 9  },
  { code: 'NP', name: 'Nepal',               dial: '+977', len: 10 },
  { code: 'ZA', name: 'South Africa',        dial: '+27',  len: 9  },
  { code: 'NG', name: 'Nigeria',             dial: '+234', len: 10 },
  { code: 'KE', name: 'Kenya',               dial: '+254', len: 9  },
  { code: 'GH', name: 'Ghana',               dial: '+233', len: 9  },
  { code: 'EG', name: 'Egypt',               dial: '+20',  len: 10 },
  { code: 'MA', name: 'Morocco',             dial: '+212', len: 9  },
  { code: 'ET', name: 'Ethiopia',            dial: '+251', len: 9  },
  { code: 'BR', name: 'Brazil',              dial: '+55',  len: 11 },
  { code: 'MX', name: 'Mexico',              dial: '+52',  len: 10 },
  { code: 'AR', name: 'Argentina',           dial: '+54',  len: 10 },
  { code: 'CO', name: 'Colombia',            dial: '+57',  len: 10 },
  { code: 'RU', name: 'Russia',              dial: '+7',   len: 10 },
  { code: 'TR', name: 'Turkey',              dial: '+90',  len: 10 },
  { code: 'IL', name: 'Israel',              dial: '+972', len: 9  },
  { code: 'IR', name: 'Iran',                dial: '+98',  len: 10 },
]

// ── Google "G" logo (official colors) ───────────────────────
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" style={{ flexShrink: 0 }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

// ── Apple logo ───────────────────────────────────────────────
const AppleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
)

const INPUT_STYLE: React.CSSProperties = {
  flex: 1,
  padding: '14px 16px',
  background: 'transparent',
  border: 'none',
  color: '#FFFFFF',
  fontSize: '15px',
  outline: 'none',
  minWidth: 0,
}

function LoginPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')
  const [country, setCountry] = useState(COUNTRIES[0])
  const [showDropdown, setShowDropdown] = useState(false)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState(
    urlError === 'google_failed' ? 'Google sign-in failed. Please try again.' :
    urlError === 'no_code' ? 'Google sign-in was cancelled.' : ''
  )
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial.includes(search)
  )

  const isPhoneValid = phone.length === country.len

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isPhoneValid) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `${country.dial}${phone}` }),
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

  const handleGoogle = async () => {
    setGoogleLoading(true)
    setError('')
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) setError(error.message)
    } catch {
      setError('Google sign-in failed. Please try again.')
    } finally {
      setGoogleLoading(false)
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
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '28px' }}>
            <Image src="/logo.jpg" alt="ChefCircle" width={42} height={42} style={{ borderRadius: '11px' }} />
            <span style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-0.02em' }}>
              <span style={{ color: '#FF6B35' }}>Chef</span>
              <span style={{ color: '#FFFFFF' }}>Circle</span>
            </span>
          </Link>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '8px', letterSpacing: '-0.025em' }}>
            Sign in / Sign up
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.65 }}>
            New here? Just enter your number — we&apos;ll create your account automatically.
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '22px',
          padding: '28px',
        }}>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            style={{
              width: '100%',
              padding: '13px 18px',
              background: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              color: '#1F1F1F',
              fontSize: '14.5px',
              fontWeight: 700,
              cursor: googleLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '10px',
              opacity: googleLoading ? 0.7 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            {googleLoading
              ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              : <GoogleIcon />
            }
            Continue with Google
          </button>

          {/* Apple */}
          <button
            disabled
            style={{
              width: '100%',
              padding: '13px 18px',
              background: '#1C1C1E',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              color: 'rgba(255,255,255,0.35)',
              fontSize: '14.5px',
              fontWeight: 700,
              cursor: 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            <AppleIcon />
            Continue with Apple
            <span style={{ fontSize: '10px', background: 'rgba(255,107,53,0.15)', color: '#FF6B35', padding: '2px 8px', borderRadius: '99px', fontWeight: 700, marginLeft: '4px' }}>
              Soon
            </span>
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.22)', fontWeight: 600, letterSpacing: '0.04em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Phone form */}
          <form onSubmit={handleSendOTP}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Mobile Number
            </label>

            <div
              style={{
                display: 'flex',
                background: 'rgba(255,255,255,0.05)',
                border: '1.5px solid rgba(255,255,255,0.09)',
                borderRadius: '12px',
                overflow: 'visible',
                marginBottom: '16px',
                position: 'relative',
              }}
              onFocus={() => {}}
            >
              {/* Country selector */}
              <div ref={dropdownRef} style={{ position: 'relative', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => { setShowDropdown(d => !d); setSearch('') }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '14px 12px 14px 14px',
                    background: 'transparent',
                    border: 'none',
                    borderRight: '1px solid rgba(255,255,255,0.07)',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#FF6B35', background: 'rgba(255,107,53,0.12)', border: '1px solid rgba(255,107,53,0.2)', borderRadius: '5px', padding: '2px 5px', letterSpacing: '0.04em' }}>{country.code}</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{country.dial}</span>
                  <ChevronDown size={12} color="rgba(255,255,255,0.35)" style={{ transition: 'transform 0.2s', transform: showDropdown ? 'rotate(180deg)' : 'rotate(0)' }} />
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    width: '240px',
                    background: '#1A1A1A',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '14px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                    zIndex: 100,
                    overflow: 'hidden',
                  }}>
                    {/* Search */}
                    <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <input
                        type="text"
                        placeholder="Search country..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        autoFocus
                        style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#FFFFFF', padding: '8px 12px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
                      {filteredCountries.map(c => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => { setCountry(c); setShowDropdown(false); setSearch(''); setPhone('') }}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '11px 14px',
                            background: c.code === country.code ? 'rgba(255,107,53,0.1)' : 'transparent',
                            border: 'none',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            textAlign: 'left',
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                          }}
                        >
                          <span style={{ fontSize: '10px', fontWeight: 800, color: c.code === country.code ? '#FF6B35' : 'rgba(255,255,255,0.45)', background: c.code === country.code ? 'rgba(255,107,53,0.12)' : 'rgba(255,255,255,0.06)', border: `1px solid ${c.code === country.code ? 'rgba(255,107,53,0.25)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '4px', padding: '2px 5px', letterSpacing: '0.04em', flexShrink: 0 }}>{c.code}</span>
                          <span style={{ fontSize: '13px', color: c.code === country.code ? '#FFFFFF' : 'rgba(255,255,255,0.75)', fontWeight: 600, flex: 1 }}>{c.name}</span>
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>{c.dial}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Phone input */}
              <input
                type="tel"
                inputMode="numeric"
                placeholder={`${'•'.repeat(country.len)}`}
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, country.len))}
                required
                style={INPUT_STYLE}
              />
            </div>

            {error && (
              <div style={{ fontSize: '13px', color: '#f87171', background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: '9px', padding: '10px 14px', marginBottom: '14px' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !isPhoneValid}
              style={{
                width: '100%',
                padding: '14px',
                background: isPhoneValid
                  ? 'linear-gradient(135deg, #FF6B35, #EA580C)'
                  : 'rgba(255,255,255,0.06)',
                color: isPhoneValid ? '#FFFFFF' : 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '15px',
                cursor: isPhoneValid && !loading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: isPhoneValid ? '0 4px 18px rgba(255,107,53,0.3)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {loading
                ? <Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} />
                : <Phone size={16} />
              }
              {loading ? 'Sending OTP…' : 'Continue with Phone'}
              {!loading && isPhoneValid && <ArrowRight size={16} />}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.18)', marginTop: '20px', lineHeight: 1.7 }}>
          By continuing you agree to our{' '}
          <Link href="#" style={{ color: 'rgba(255,107,53,0.7)', textDecoration: 'none' }}>Terms</Link>
          {' & '}
          <Link href="#" style={{ color: 'rgba(255,107,53,0.7)', textDecoration: 'none' }}>Privacy Policy</Link>
        </p>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg) } }
          input::placeholder { color: rgba(255,255,255,0.15); }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
        `}</style>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  )
}
