'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Signing you in…')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const error = params.get('error')

    if (error || !code) {
      router.replace('/auth/login?error=google_failed')
      return
    }

    fetch('/api/auth/google-callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        redirect_uri: `${window.location.origin}/auth/callback`,
      }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.redirectTo) {
          router.replace(data.redirectTo)
        } else {
          setStatus('Something went wrong…')
          router.replace('/auth/login?error=google_failed')
        }
      })
      .catch(() => router.replace('/auth/login?error=google_failed'))
  }, [router])

  return (
    <div style={{ minHeight: '100vh', background: '#0B0B0B', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <div style={{ width: '44px', height: '44px', border: '3px solid rgba(255,107,53,0.2)', borderTop: '3px solid #FF6B35', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>{status}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
