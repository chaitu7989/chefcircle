'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.replace('/admin')
      } else {
        setError('Invalid password')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '360px', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#FF6B35', marginBottom: '4px' }}>⚙ Admin</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>ChefCircle Operations Panel</div>
        </div>
        <form onSubmit={handleLogin} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', padding: '28px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Admin Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter admin password"
            required
            style={{ width: '100%', padding: '13px 14px', background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.09)', borderRadius: '10px', color: '#fff', fontSize: '15px', outline: 'none', marginBottom: '16px', boxSizing: 'border-box' }}
          />
          {error && (
            <div style={{ fontSize: '13px', color: '#f87171', background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: '8px', padding: '10px 12px', marginBottom: '14px' }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            style={{ width: '100%', padding: '13px', background: password ? 'linear-gradient(135deg,#FF6B35,#EA580C)' : 'rgba(255,255,255,0.06)', color: password ? '#fff' : 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '15px', cursor: password && !loading ? 'pointer' : 'not-allowed' }}
          >
            {loading ? 'Signing in…' : 'Access Dashboard'}
          </button>
        </form>
        <style>{`input::placeholder { color: rgba(255,255,255,0.2); }`}</style>
      </div>
    </div>
  )
}
