'use client'

import { useState, useRef, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react'

function VerifyPageContent() {
  const router = useRouter()
  const params = useSearchParams()
  const phone = params.get('phone') ?? ''

  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendCountdown, setResendCountdown] = useState(30)
  const [resending, setResending] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  // Resend countdown
  useEffect(() => {
    if (resendCountdown <= 0) return
    const t = setTimeout(() => setResendCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCountdown])

  const handleDigit = (index: number, value: string) => {
    const char = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = char
    setDigits(next)
    if (char && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setDigits(pasted.split(''))
      inputRefs.current[5]?.focus()
    }
    e.preventDefault()
  }

  const otp = digits.join('')

  const verify = useCallback(async (code: string) => {
    if (code.length !== 6) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp: code }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }

      if (data.isNewUser || !data.onboardingComplete) {
        router.push('/auth/onboarding')
      } else {
        router.push(data.role === 'chef' ? '/chef/dashboard' : '/customer/dashboard')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [phone, router])

  // Auto-submit when all 6 digits filled
  useEffect(() => {
    if (otp.length === 6) verify(otp)
  }, [otp, verify])

  const handleResend = async () => {
    setResending(true)
    setError('')
    setDigits(['', '', '', '', '', ''])
    inputRefs.current[0]?.focus()
    try {
      await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      setResendCountdown(30)
    } finally {
      setResending(false)
    }
  }

  const digitBox: React.CSSProperties = {
    width: '52px',
    height: '60px',
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 800,
    color: '#FFFFFF',
    background: 'rgba(255,255,255,0.05)',
    border: '1.5px solid rgba(255,255,255,0.1)',
    borderRadius: '14px',
    outline: 'none',
    caretColor: '#FF6B35',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B0B0B', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '32px' }}>
            <Image src="/logo.jpg" alt="ChefCircle" width={40} height={40} style={{ borderRadius: '10px' }} />
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF' }}>
              <span style={{ color: '#FF6B35' }}>Chef</span>Circle
            </span>
          </Link>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📱</div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Enter OTP
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>
            We sent a 6-digit code to<br />
            <strong style={{ color: 'rgba(255,255,255,0.7)' }}>+91 {phone}</strong>
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '32px' }}>

          {/* 6-digit OTP boxes */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '24px' }}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el }}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleDigit(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                style={{
                  ...digitBox,
                  borderColor: d ? 'rgba(255,107,53,0.5)' : 'rgba(255,255,255,0.1)',
                  background: d ? 'rgba(255,107,53,0.06)' : 'rgba(255,255,255,0.05)',
                }}
              />
            ))}
          </div>

          {error && (
            <p style={{ fontSize: '13px', color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', textAlign: 'center' }}>
              {error}
            </p>
          )}

          {loading && (
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Loader2 size={20} color="#FF6B35" style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }} />
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginTop: '6px' }}>Verifying…</p>
            </div>
          )}

          {/* Resend */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            {resendCountdown > 0 ? (
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)' }}>
                Resend OTP in <strong style={{ color: 'rgba(255,255,255,0.45)' }}>{resendCountdown}s</strong>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FF6B35', fontSize: '13px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <RefreshCw size={13} style={resending ? { animation: 'spin 1s linear infinite' } : {}} />
                {resending ? 'Sending…' : 'Resend OTP'}
              </button>
            )}
          </div>

          <p style={{ fontSize: '11px', textAlign: 'center', color: 'rgba(255,255,255,0.18)', marginTop: '12px' }}>
            OTP expires in 5 minutes
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link href="/auth/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontWeight: 600 }}>
            <ArrowLeft size={14} /> Change number
          </Link>
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyPageContent />
    </Suspense>
  )
}
