'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight,
  Flame,
  CalendarDays,
  Users,
  ChefHat,
  UtensilsCrossed,
  ShoppingBag,
  Store,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]
const FADE_UP = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
}
const STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}
const VP = { once: true, amount: 0.1 }

export default function HomePage() {
  return (
    <div style={{ background: '#FFFFFF', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ─────────────────────────────────────────────
          HERO
          ───────────────────────────────────────────── */}
      <section
        style={{
          background: '#111827',
          minHeight: '78vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Single subtle radial glow — pure CSS, no JS */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '420px',
          background: 'radial-gradient(ellipse, rgba(255,107,53,0.1) 0%, transparent 68%)',
          pointerEvents: 'none',
        }} />

        {/* Smooth wave into white */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 56" preserveAspectRatio="none" style={{ width: '100%', height: '56px', display: 'block' }}>
            <path d="M0,28 C360,56 1080,0 1440,28 L1440,56 L0,56 Z" fill="#FFFFFF" />
          </svg>
        </div>

        <motion.div
          variants={STAGGER}
          initial="hidden"
          animate="show"
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            padding: '64px 24px 88px',
            maxWidth: '780px',
            width: '100%',
          }}
        >
          {/* Status badge */}
          <motion.div variants={FADE_UP} style={{ marginBottom: '28px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              background: 'rgba(255,107,53,0.08)',
              border: '1px solid rgba(255,107,53,0.2)',
              borderRadius: '999px',
              padding: '6px 16px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#FF6B35',
              letterSpacing: '0.08em',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', flexShrink: 0 }} />
              LAUNCHING IN HYDERABAD
            </span>
          </motion.div>

          {/* Headline — solid colors, no broken CSS gradient text */}
          <motion.h1
            variants={FADE_UP}
            style={{
              fontSize: 'clamp(2.6rem, 7vw, 5.4rem)',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.08,
              marginBottom: '18px',
              letterSpacing: '-0.03em',
            }}
          >
            Every Kitchen Can<br />
            Become A{' '}
            <span style={{ color: '#FF6B35' }}>Business.</span>
          </motion.h1>

          <motion.p
            variants={FADE_UP}
            style={{
              fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
              color: 'rgba(255,255,255,0.48)',
              maxWidth: '480px',
              margin: '0 auto 36px',
              lineHeight: 1.9,
            }}
          >
            ChefCircle lets home cooks list dishes, set their own hours,
            and earn money from customers in their neighbourhood.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={FADE_UP}
            style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}
          >
            <Link
              href="/customer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '13px 30px',
                background: '#FF6B35',
                color: 'white',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
                boxShadow: '0 3px 14px rgba(255,107,53,0.38)',
              }}
            >
              Explore Kitchens
            </Link>
            <Link
              href="/chef/register"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '13px 30px',
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.82)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              Become A Chef <ArrowRight size={15} />
            </Link>
          </motion.div>

          {/* Stats strip — shows 0 until real data */}
          <motion.div
            variants={FADE_UP}
            style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}
          >
            {[
              { icon: <ChefHat size={14} />, value: 0, label: 'Home Chefs' },
              { icon: <UtensilsCrossed size={14} />, value: 0, label: 'Dishes Listed' },
              { icon: <ShoppingBag size={14} />, value: 0, label: 'Orders' },
            ].map(s => (
              <div
                key={s.label}
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '8px',
                  padding: '8px 14px',
                }}
              >
                <span style={{ color: '#FF6B35', display: 'flex' }}>{s.icon}</span>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>{s.value}</span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>


      {/* ─────────────────────────────────────────────
          WHY CHEFCIRCLE — white bg, 3 feature cards
          ───────────────────────────────────────────── */}
      <section style={{ background: '#FFFFFF', padding: '88px 24px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <motion.div variants={STAGGER} initial="hidden" whileInView="show" viewport={VP}>

            <motion.div variants={FADE_UP} style={{ textAlign: 'center', marginBottom: '52px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#FF6B35', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
                Why ChefCircle
              </p>
              <h2 style={{ fontSize: 'clamp(1.65rem, 3.5vw, 2.75rem)', fontWeight: 900, color: '#111827', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Built for home cooks,<br />not restaurants.
              </h2>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '16px' }}>
              {[
                {
                  icon: <Flame size={20} />,
                  title: 'Cook From Home',
                  desc: 'List your dishes, set your price, and start earning from your kitchen. No restaurant licence, no upfront investment.',
                },
                {
                  icon: <CalendarDays size={20} />,
                  title: 'Your Schedule',
                  desc: 'Open for breakfast, lunch, dinner — or all three. Toggle your kitchen on and off whenever you like.',
                },
                {
                  icon: <Users size={20} />,
                  title: 'Community Demand',
                  desc: 'Customers request dishes. When enough people want the same dish, you get notified and can prepare it in bulk.',
                },
              ].map(card => (
                <motion.div
                  key={card.title}
                  variants={FADE_UP}
                  style={{
                    background: '#FAFAFA',
                    border: '1px solid #F0F0F0',
                    borderRadius: '16px',
                    padding: '32px 28px',
                  }}
                >
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: '#FFF0EB',
                    color: '#FF6B35',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '18px',
                  }}>
                    {card.icon}
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', marginBottom: '10px', letterSpacing: '-0.01em' }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#6B7280', lineHeight: 1.75 }}>
                    {card.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────
          HOW IT WORKS — light gray, 3 steps
          ───────────────────────────────────────────── */}
      <section style={{ background: '#F5F5F5', padding: '88px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.div variants={STAGGER} initial="hidden" whileInView="show" viewport={VP}>

            <motion.div variants={FADE_UP} style={{ textAlign: 'center', marginBottom: '56px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#FF6B35', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
                How It Works
              </p>
              <h2 style={{ fontSize: 'clamp(1.65rem, 3.5vw, 2.75rem)', fontWeight: 900, color: '#111827', letterSpacing: '-0.02em' }}>
                Start earning in 3 steps.
              </h2>
            </motion.div>

            <div style={{ position: 'relative' }}>
              <div className="steps-connector" style={{
                position: 'absolute',
                top: '26px',
                left: 'calc(16.5% + 18px)',
                right: 'calc(16.5% + 18px)',
                height: '1px',
                background: '#E5E7EB',
                zIndex: 0,
              }} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
                {[
                  {
                    icon: <Store size={18} />,
                    title: 'Register Kitchen',
                    desc: 'Create your chef profile and describe your speciality. Takes less than 5 minutes.',
                    active: true,
                  },
                  {
                    icon: <UtensilsCrossed size={18} />,
                    title: 'Add Your Dishes',
                    desc: 'List what you cook, add pricing, and set how many portions you can make per day.',
                    active: false,
                  },
                  {
                    icon: <TrendingUp size={18} />,
                    title: 'Start Earning',
                    desc: 'Go online and start receiving orders from customers in your neighbourhood.',
                    active: false,
                  },
                ].map((step, i) => (
                  <motion.div
                    key={step.title}
                    variants={FADE_UP}
                    style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
                  >
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '50%',
                      background: step.active ? '#FF6B35' : '#FFFFFF',
                      border: `2px solid ${step.active ? '#FF6B35' : '#E5E7EB'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 20px',
                      color: step.active ? '#FFFFFF' : '#9CA3AF',
                      boxShadow: step.active ? '0 4px 16px rgba(255,107,53,0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
                    }}>
                      {step.icon}
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#FF6B35', letterSpacing: '0.08em', marginBottom: '6px' }}>
                      STEP {String(i + 1).padStart(2, '0')}
                    </div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.7, maxWidth: '200px', margin: '0 auto' }}>
                      {step.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div variants={FADE_UP} style={{ textAlign: 'center', marginTop: '48px' }}>
              <Link
                href="/chef/register"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  padding: '12px 28px',
                  background: '#111827',
                  color: 'white',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                Register Your Kitchen <ArrowRight size={15} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────
          COMMUNITY DRIVEN — dark, orange only
          ───────────────────────────────────────────── */}
      <section style={{ background: '#111827', padding: '88px 24px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '64px',
            alignItems: 'center',
          }}>

            {/* Left text */}
            <motion.div variants={STAGGER} initial="hidden" whileInView="show" viewport={VP}>
              <motion.p variants={FADE_UP} style={{ fontSize: '11px', fontWeight: 700, color: '#FF6B35', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '18px' }}>
                Community Driven
              </motion.p>
              <motion.h2
                variants={FADE_UP}
                style={{ fontSize: 'clamp(1.65rem, 3.5vw, 2.75rem)', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '18px' }}
              >
                Your neighbourhood<br />decides what gets{' '}
                <span style={{ color: '#FF6B35' }}>cooked.</span>
              </motion.h2>
              <motion.p
                variants={FADE_UP}
                style={{ fontSize: '14.5px', color: 'rgba(255,255,255,0.42)', lineHeight: 1.85, marginBottom: '28px', maxWidth: '380px' }}
              >
                Customers post dish requests. When demand reaches a threshold,
                the home chef prepares it for the next day — demand-driven cooking,
                zero waste.
              </motion.p>
              <motion.div variants={FADE_UP} style={{ display: 'flex', flexDirection: 'column', gap: '11px', marginBottom: '32px' }}>
                {[
                  'Chef gets notified when demand is high',
                  'Cook only what your community wants',
                  'Customers get home-style food on request',
                ].map(pt => (
                  <div key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle2 size={15} color="#FF6B35" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{pt}</span>
                  </div>
                ))}
              </motion.div>
              <motion.div variants={FADE_UP}>
                <Link
                  href="/customer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                    padding: '11px 22px',
                    background: 'rgba(255,107,53,0.1)',
                    color: '#FF6B35',
                    border: '1px solid rgba(255,107,53,0.2)',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    textDecoration: 'none',
                  }}
                >
                  Explore Platform <ArrowRight size={14} />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right — empty state panel */}
            <motion.div
              variants={FADE_UP}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.08 }}
            >
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '20px',
                overflow: 'hidden',
              }}>
                {/* Panel header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '18px 24px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '2px' }}>Community Requests</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.22)' }}>Hyderabad · All Areas</p>
                  </div>
                  <span style={{
                    background: 'rgba(255,107,53,0.1)',
                    color: '#FF6B35',
                    border: '1px solid rgba(255,107,53,0.18)',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}>
                    Live
                  </span>
                </div>

                {/* Empty state body */}
                <div style={{ textAlign: 'center', padding: '52px 24px' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    background: 'rgba(255,107,53,0.08)',
                    border: '1px solid rgba(255,107,53,0.14)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                    color: '#FF6B35',
                  }}>
                    <MessageSquare size={20} />
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.55)', marginBottom: '8px' }}>
                    No requests yet
                  </p>
                  <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.22)', lineHeight: 1.75, maxWidth: '220px', margin: '0 auto 24px' }}>
                    Customer requests will appear here once the platform goes live.
                  </p>
                  <Link
                    href="/customer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '9px 18px',
                      background: '#FF6B35',
                      color: 'white',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      textDecoration: 'none',
                    }}
                  >
                    Request a Dish
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────
          FINAL CTA — orange gradient
          ───────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #FF6B35 0%, #EA580C 60%, #C2410C 100%)',
        padding: '96px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-160px', right: '-160px',
          width: '460px', height: '460px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          pointerEvents: 'none',
        }} />

        <motion.div
          variants={STAGGER}
          initial="hidden"
          whileInView="show"
          viewport={VP}
          style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', position: 'relative' }}
        >
          <motion.p
            variants={FADE_UP}
            style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '18px' }}
          >
            Join ChefCircle
          </motion.p>

          <motion.h2
            variants={FADE_UP}
            style={{
              fontSize: 'clamp(2.2rem, 6vw, 4.2rem)',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: '18px',
            }}
          >
            Build The Future<br />Of Homemade Food
          </motion.h2>

          <motion.p
            variants={FADE_UP}
            style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.68)', lineHeight: 1.85, maxWidth: '440px', margin: '0 auto 40px' }}
          >
            Turn your passion into income. Join ChefCircle and start earning from your kitchen.
          </motion.p>

          <motion.div
            variants={FADE_UP}
            style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link
              href="/chef/register"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '14px 34px',
                background: '#FFFFFF',
                color: '#EA580C',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '14.5px',
                textDecoration: 'none',
                boxShadow: '0 4px 18px rgba(0,0,0,0.12)',
              }}
            >
              Become A Chef
            </Link>
            <Link
              href="/customer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '14px 34px',
                background: 'rgba(255,255,255,0.12)',
                color: '#FFFFFF',
                border: '1.5px solid rgba(255,255,255,0.28)',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '14.5px',
                textDecoration: 'none',
              }}
            >
              Explore Kitchens <ArrowRight size={15} />
            </Link>
          </motion.div>

          <motion.p
            variants={FADE_UP}
            style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.38)', marginTop: '24px' }}
          >
            Free to join · No investment required · Cook from home
          </motion.p>
        </motion.div>
      </section>

    </div>
  )
}
