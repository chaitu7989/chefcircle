'use client'

import Image from 'next/image'

export default function Footer() {
  return (
    <footer style={{ background: '#0D0D0D', color: '#71717A', padding: '64px 24px 40px' }}>
      <div className="max-w-7xl mx-auto">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', justifyContent: 'space-between', marginBottom: '48px' }}>

          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Image src="/logo.jpg" alt="ChefCircle" width={42} height={42} style={{ borderRadius: '12px', opacity: 0.85 }} />
            <div>
              <div>
                <span style={{ fontSize: '17px', fontWeight: 800, color: '#FF6B35' }}>Chef</span>
                <span style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF' }}>Circle</span>
              </div>
              <p style={{ fontSize: '9px', color: '#52525B', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '2px' }}>
                Cook · Connect · Earn
              </p>
            </div>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: '64px', fontSize: '13px' }}>
            <div>
              <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>Platform</p>
              {([['Explore', '/customer'], ['Become a Chef', '/chef/register'], ['App Preview', '/mobile']] as const).map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  style={{ display: 'block', marginBottom: '10px', color: '#71717A', textDecoration: 'none' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#FF6B35')}
                  onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#71717A')}
                >
                  {label}
                </a>
              ))}
            </div>
            <div>
              <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>Company</p>
              {([['How it Works', '#'], ['Privacy Policy', '#'], ['Terms of Service', '#']] as const).map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  style={{ display: 'block', marginBottom: '10px', color: '#71717A', textDecoration: 'none' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#FF6B35')}
                  onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#71717A')}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '12px', color: '#3F3F46' }}>© 2025 ChefCircle Technologies Pvt. Ltd. Hyderabad, India.</p>
          <p style={{ fontSize: '12px', color: '#3F3F46' }}>Built for the home chef community.</p>
        </div>
      </div>
    </footer>
  )
}
