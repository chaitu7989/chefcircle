'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, LogIn } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const navLinks = [
    { href: '/customer',     label: 'Explore'       },
    { href: '/chef/register',label: 'Become A Chef' },
    { href: '/mobile',       label: 'App'           },
  ]

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <Image src="/logo.jpg" alt="ChefCircle" width={38} height={38} style={{ borderRadius: '12px', objectFit: 'contain' }} priority />
            <div style={{ lineHeight: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.01em' }}>
                <span style={{ color: '#5C3317' }}>Chef</span>
                <span style={{ color: '#FF6B35' }}>Circle</span>
              </div>
              <p style={{ fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.12em', color: '#A8A29E', textTransform: 'uppercase', marginTop: '2px' }}>
                Cook · Connect · Earn
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} style={{ padding: '8px 18px', borderRadius: '999px', fontSize: '14px', fontWeight: 600, color: '#374151', textDecoration: 'none', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.target as HTMLAnchorElement).style.background = '#FFF8F2'; (e.target as HTMLAnchorElement).style.color = '#FF6B35' }}
                onMouseLeave={e => { (e.target as HTMLAnchorElement).style.background = 'transparent'; (e.target as HTMLAnchorElement).style.color = '#374151' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login" style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 22px', background: '#111827', color: 'white', borderRadius: '999px', fontWeight: 700, fontSize: '14px', textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
              <LogIn style={{ width: '14px', height: '14px' }} />
              Sign In
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
            style={{ padding: '8px', borderRadius: '12px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#374151' }}
          >
            {open ? <X style={{ width: '20px', height: '20px' }} /> : <Menu style={{ width: '20px', height: '20px' }} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: 'white', borderTop: '1px solid rgba(0,0,0,0.06)', padding: '12px 16px 20px' }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              style={{ display: 'block', padding: '12px 16px', borderRadius: '14px', fontSize: '15px', fontWeight: 600, color: '#374151', textDecoration: 'none', marginBottom: '4px' }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: '8px' }}>
            <Link href="/auth/login" onClick={() => setOpen(false)}
              style={{ display: 'block', textAlign: 'center', padding: '13px', background: '#111827', color: 'white', borderRadius: '14px', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
