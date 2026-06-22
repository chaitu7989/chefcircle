'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChefHat, ShoppingBag, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

export default function OnboardingPage() {
  const router = useRouter()

  const roles = [
    {
      key: 'customer',
      icon: <ShoppingBag size={28} />,
      title: 'I want to order',
      subtitle: 'Discover and order home-cooked food from chefs in my neighbourhood.',
      cta: 'Continue as Customer',
      href: '/auth/onboarding/customer',
    },
    {
      key: 'chef',
      icon: <ChefHat size={28} />,
      title: 'I want to cook',
      subtitle: 'Register my home kitchen, list my dishes, and start earning.',
      cta: 'Continue as Chef',
      href: '/auth/onboarding/chef',
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0B0B0B', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '560px' }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '32px' }}>
            <Image src="/logo.jpg" alt="ChefCircle" width={40} height={40} style={{ borderRadius: '10px' }} />
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF' }}>
              <span style={{ color: '#FF6B35' }}>Chef</span>Circle
            </span>
          </Link>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '10px', letterSpacing: '-0.02em' }}>
            How would you like to use ChefCircle?
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>
            You can always switch roles later from your settings.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {roles.map((role, i) => (
            <motion.button
              key={role.key}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.1 + i * 0.08 }}
              onClick={() => router.push(role.href)}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1.5px solid rgba(255,255,255,0.07)',
                borderRadius: '20px',
                padding: '32px 24px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.18s',
              }}
              whileHover={{ borderColor: 'rgba(255,107,53,0.4)', background: 'rgba(255,107,53,0.04)', scale: 1.01 }}
            >
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(255,107,53,0.1)', color: '#FF6B35', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                {role.icon}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px', letterSpacing: '-0.01em' }}>
                {role.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.7, marginBottom: '20px' }}>
                {role.subtitle}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#FF6B35' }}>
                {role.cta} <ArrowRight size={14} />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
