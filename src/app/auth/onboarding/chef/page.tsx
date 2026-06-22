'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2, ChefHat } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

const CUISINES = ['North Indian', 'South Indian', 'Hyderabadi', 'Andhra', 'Bengali', 'Gujarati', 'Punjabi', 'Maharashtra', 'Kerala', 'Chinese', 'Continental', 'Mughlai', 'Street Food', 'Desserts & Sweets']

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

type TimingSlot = { open: string; close: string; enabled: boolean }
type Timings = Record<string, TimingSlot>

type FormData = {
  full_name: string
  email: string
  kitchen_name: string
  about: string
  cuisine_types: string[]
  years_experience: string
  cooking_address: string
  service_radius: string
  available_timings: Timings
}

const STEPS = ['Basic Info', 'Kitchen Details', 'Schedule', 'Review']

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '13px 16px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '12px',
  color: '#FFFFFF',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
}

const defaultTimings: Timings = Object.fromEntries(
  DAYS.map(d => [d, { open: '09:00', close: '20:00', enabled: false }])
)

export default function ChefOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState<FormData>({
    full_name: '',
    email: '',
    kitchen_name: '',
    about: '',
    cuisine_types: [],
    years_experience: '',
    cooking_address: '',
    service_radius: '5',
    available_timings: defaultTimings,
  })

  const set = (key: keyof FormData, val: string) => setForm(f => ({ ...f, [key]: val }))

  const toggleCuisine = (c: string) =>
    setForm(f => ({
      ...f,
      cuisine_types: f.cuisine_types.includes(c)
        ? f.cuisine_types.filter(x => x !== c)
        : [...f.cuisine_types, c],
    }))

  const toggleDay = (day: string) =>
    setForm(f => ({
      ...f,
      available_timings: {
        ...f.available_timings,
        [day]: { ...f.available_timings[day], enabled: !f.available_timings[day].enabled },
      },
    }))

  const setTiming = (day: string, key: 'open' | 'close', val: string) =>
    setForm(f => ({
      ...f,
      available_timings: {
        ...f.available_timings,
        [day]: { ...f.available_timings[day], [key]: val },
      },
    }))

  const goNext = () => {
    setError('')
    if (step === 0 && !form.full_name.trim()) { setError('Full name is required'); return }
    if (step === 1 && !form.kitchen_name.trim()) { setError('Kitchen name is required'); return }
    setDirection(1)
    setStep(s => s + 1)
  }

  const goBack = () => {
    setDirection(-1)
    setStep(s => s - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/onboarding/chef', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          years_experience: form.years_experience ? Number(form.years_experience) : null,
          service_radius: Number(form.service_radius),
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      router.push('/chef/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const variants = {
    enter: { x: direction * 40, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: direction * -40, opacity: 0 },
  }

  const Label = ({ children }: { children: React.ReactNode }) => (
    <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '8px' }}>
      {children}
    </p>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0B0B0B', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '24px' }}>
            <Image src="/logo.jpg" alt="ChefCircle" width={36} height={36} style={{ borderRadius: '9px' }} />
            <span style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF' }}>
              <span style={{ color: '#FF6B35' }}>Chef</span>Circle
            </span>
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '6px', letterSpacing: '-0.02em' }}>
            Set up your kitchen
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>Step {step + 1} of {STEPS.length}</p>
        </div>

        {/* Progress bar */}
        <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', marginBottom: '28px', overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ height: '100%', background: 'linear-gradient(90deg, #FF6B35, #FFB000)', borderRadius: '99px' }}
          />
        </div>

        {/* Step labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '26px', height: '26px', borderRadius: '50%',
                background: i < step ? '#FF6B35' : i === step ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1.5px solid ${i <= step ? '#FF6B35' : 'rgba(255,255,255,0.08)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 800,
                color: i <= step ? '#FF6B35' : 'rgba(255,255,255,0.2)',
              }}>
                {i < step ? <CheckCircle2 size={13} /> : i + 1}
              </div>
              <span style={{ fontSize: '10px', color: i === step ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '28px', overflow: 'hidden', position: 'relative' }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: EASE }}
            >

              {/* STEP 0 — Basic Info */}
              {step === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <Label>Full Name *</Label>
                    <input type="text" placeholder="Your full name" value={form.full_name} onChange={e => set('full_name', e.target.value)} style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = 'rgba(255,107,53,0.4)' }} onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)' }} />
                  </div>
                  <div>
                    <Label>Email <span style={{ textTransform: 'none', color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>(optional)</span></Label>
                    <input type="email" placeholder="chef@email.com" value={form.email} onChange={e => set('email', e.target.value)} style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = 'rgba(255,107,53,0.4)' }} onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)' }} />
                  </div>
                </div>
              )}

              {/* STEP 1 — Kitchen Details */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <Label>Kitchen Name *</Label>
                    <input type="text" placeholder="e.g. Amma's Kitchen" value={form.kitchen_name} onChange={e => set('kitchen_name', e.target.value)} style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = 'rgba(255,107,53,0.4)' }} onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)' }} />
                  </div>
                  <div>
                    <Label>About Your Kitchen <span style={{ textTransform: 'none', color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>(optional)</span></Label>
                    <textarea
                      placeholder="Tell customers what makes your kitchen special..."
                      value={form.about}
                      onChange={e => set('about', e.target.value)}
                      rows={3}
                      style={{ ...inputStyle, padding: '13px 16px', resize: 'none', lineHeight: 1.6 }}
                      onFocus={e => { e.target.style.borderColor = 'rgba(255,107,53,0.4)' }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)' }}
                    />
                  </div>
                  <div>
                    <Label>Cuisine Types</Label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                      {CUISINES.map(c => {
                        const sel = form.cuisine_types.includes(c)
                        return (
                          <button key={c} type="button" onClick={() => toggleCuisine(c)}
                            style={{ padding: '6px 12px', borderRadius: '99px', border: `1px solid ${sel ? '#FF6B35' : 'rgba(255,255,255,0.1)'}`, background: sel ? 'rgba(255,107,53,0.12)' : 'transparent', color: sel ? '#FF6B35' : 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>
                            {c}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <Label>Years of Experience <span style={{ textTransform: 'none', color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>(optional)</span></Label>
                    <input type="number" placeholder="e.g. 5" min={0} max={50} value={form.years_experience} onChange={e => set('years_experience', e.target.value)} style={{ ...inputStyle, width: '120px' }}
                      onFocus={e => { e.target.style.borderColor = 'rgba(255,107,53,0.4)' }} onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)' }} />
                  </div>
                </div>
              )}

              {/* STEP 2 — Schedule */}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <Label>Cooking Address <span style={{ textTransform: 'none', color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>(optional)</span></Label>
                    <input type="text" placeholder="Area, Hyderabad" value={form.cooking_address} onChange={e => set('cooking_address', e.target.value)} style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = 'rgba(255,107,53,0.4)' }} onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)' }} />
                  </div>
                  <div>
                    <Label>Service Radius (km)</Label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {['1', '2', '3', '5', '10'].map(r => (
                        <button key={r} type="button" onClick={() => set('service_radius', r)}
                          style={{ padding: '8px 16px', borderRadius: '99px', border: `1px solid ${form.service_radius === r ? '#FF6B35' : 'rgba(255,255,255,0.1)'}`, background: form.service_radius === r ? 'rgba(255,107,53,0.12)' : 'transparent', color: form.service_radius === r ? '#FF6B35' : 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                          {r} km
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Available Days & Times</Label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {DAYS.map(day => {
                        const slot = form.available_timings[day]
                        return (
                          <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: `1px solid ${slot.enabled ? 'rgba(255,107,53,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
                            <button type="button" onClick={() => toggleDay(day)} style={{ flexShrink: 0, width: '36px', height: '20px', borderRadius: '99px', background: slot.enabled ? '#FF6B35' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                              <span style={{ position: 'absolute', top: '2px', width: '16px', height: '16px', borderRadius: '50%', background: 'white', transition: 'left 0.2s', left: slot.enabled ? '18px' : '2px' }} />
                            </button>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: slot.enabled ? '#FFFFFF' : 'rgba(255,255,255,0.3)', width: '32px' }}>{day}</span>
                            {slot.enabled && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                                <input type="time" value={slot.open} onChange={e => setTiming(day, 'open', e.target.value)}
                                  style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '7px', color: '#FFFFFF', padding: '4px 8px', fontSize: '12px', outline: 'none', colorScheme: 'dark' }} />
                                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>to</span>
                                <input type="time" value={slot.close} onChange={e => setTiming(day, 'close', e.target.value)}
                                  style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '7px', color: '#FFFFFF', padding: '4px 8px', fontSize: '12px', outline: 'none', colorScheme: 'dark' }} />
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 — Review */}
              {step === 3 && (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'rgba(255,107,53,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#FF6B35' }}>
                      <ChefHat size={28} />
                    </div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '6px' }}>Ready to launch your kitchen?</h2>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>Review your details before going live.</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                    {[
                      { label: 'Name', value: form.full_name },
                      { label: 'Kitchen', value: form.kitchen_name },
                      { label: 'Cuisines', value: form.cuisine_types.join(', ') || '—' },
                      { label: 'Address', value: form.cooking_address || '—' },
                      { label: 'Service radius', value: `${form.service_radius} km` },
                      { label: 'Available days', value: DAYS.filter(d => form.available_timings[d].enabled).join(', ') || 'Not set' },
                    ].map(row => (
                      <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: 600, whiteSpace: 'nowrap' }}>{row.label}</span>
                        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', fontWeight: 600, textAlign: 'right', wordBreak: 'break-word' }}>{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', textAlign: 'center', lineHeight: 1.7, marginBottom: '16px' }}>
                    Your kitchen will be listed as <strong style={{ color: 'rgba(255,107,53,0.7)' }}>Pending Verification</strong>. You can add dishes and set yourself online after completing setup.
                  </p>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {error && (
            <p style={{ fontSize: '13px', color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: '8px', padding: '10px 14px', marginTop: '16px' }}>
              {error}
            </p>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
            {step > 0 && (
              <button onClick={goBack}
                style={{ flex: 1, padding: '13px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}>
                <ArrowLeft size={15} /> Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button onClick={goNext}
                style={{ flex: 2, padding: '13px', background: 'linear-gradient(135deg, #FF6B35, #EA580C)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 800, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', boxShadow: '0 4px 16px rgba(255,107,53,0.3)' }}>
                Continue <ArrowRight size={15} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                style={{ flex: 2, padding: '13px', background: loading ? 'rgba(255,107,53,0.4)' : 'linear-gradient(135deg, #FF6B35, #EA580C)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 800, fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', boxShadow: '0 4px 16px rgba(255,107,53,0.3)' }}>
                {loading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <ChefHat size={15} />}
                {loading ? 'Launching…' : 'Launch My Kitchen'}
              </button>
            )}
          </div>
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )
}
