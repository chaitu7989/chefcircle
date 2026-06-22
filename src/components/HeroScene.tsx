'use client'

function House({ top, left, icon, label, delay }: { top: string; left: string; icon: string; label: string; delay: number }) {
  return (
    <div style={{ position: 'absolute', top, left, textAlign: 'center', animation: `ccFloat ${3.5 + delay * 0.4}s ease-in-out ${delay * 0.5}s infinite` }}>
      {/* Roof */}
      <div style={{ width: 0, height: 0, borderLeft: '42px solid transparent', borderRight: '42px solid transparent', borderBottom: '30px solid rgba(255,107,53,0.22)', margin: '0 auto' }} />
      {/* Body */}
      <div style={{ width: '84px', height: '68px', background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid rgba(255,107,53,0.16)', borderRadius: '0 0 14px 14px', boxShadow: '0 8px 28px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
        <span style={{ fontSize: '24px', lineHeight: 1 }}>{icon}</span>
        <span style={{ fontSize: '8px', color: '#92400e', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</span>
      </div>
    </div>
  )
}

function Customer({ top, left, delay }: { top: string; left: string; delay: number }) {
  return (
    <div style={{ position: 'absolute', top, left, animation: `ccFloat ${3 + delay * 0.3}s ease-in-out ${delay * 0.4}s infinite` }}>
      <div style={{ width: '54px', height: '62px', background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(76,175,80,0.22)', borderRadius: '14px', boxShadow: '0 4px 18px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
        <span style={{ fontSize: '20px' }}>📱</span>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4CAF50', boxShadow: '0 0 6px #4CAF50' }} />
      </div>
    </div>
  )
}

export default function HeroScene() {
  const floatingIcons = [
    { icon: '🍛', top: '20%', left: '23%', delay: 0.3, size: 24 },
    { icon: '❤️', top: '22%', left: '70%', delay: 1.1, size: 22 },
    { icon: '🔔', top: '60%', left: '16%', delay: 0.7, size: 22 },
    { icon: '✨', top: '57%', left: '80%', delay: 1.4, size: 20 },
    { icon: '🟢', top: '12%', left: '57%', delay: 0.9, size: 18 },
    { icon: '🥘', top: '72%', left: '50%', delay: 0.5, size: 22 },
    { icon: '📢', top: '32%', left: '87%', delay: 1.8, size: 18 },
    { icon: '✨', top: '30%', left: '8%', delay: 2.1, size: 16 },
  ]

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      <style>{`
        @keyframes ccFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes ccPulseRing { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.5} 50%{transform:translate(-50%,-50%) scale(1.07);opacity:.9} }
        @keyframes ccSpinSlow { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes ccSpinRev { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(-360deg)} }
        @keyframes ccGlow { 0%,100%{opacity:.4} 50%{opacity:.8} }
      `}</style>

      {/* ── SVG connection lines ── */}
      <svg viewBox="0 0 1440 860" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="og1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B35" stopOpacity="0" />
            <stop offset="60%" stopColor="#FF6B35" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#FF6B35" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="gg1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#4CAF50" stopOpacity="0" />
          </linearGradient>
          <filter id="dotglow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Chef → Center lines (orange) */}
        {[
          { id: 'h1', d: 'M 175 205 C 360 295 530 365 720 435', dur: '2.8s' },
          { id: 'h2', d: 'M 655 140 C 675 255 695 345 720 435', dur: '2.2s' },
          { id: 'h3', d: 'M 1265 205 C 1080 295 920 365 720 435', dur: '3.1s' },
          { id: 'h4', d: 'M 120 415 C 310 420 510 428 720 435', dur: '2.6s' },
          { id: 'h5', d: 'M 1320 415 C 1130 422 930 428 720 435', dur: '3.4s' },
        ].map(p => (
          <g key={p.id}>
            <path id={p.id} d={p.d} fill="none" stroke="url(#og1)" strokeWidth="1.8" strokeDasharray="9 6">
              <animate attributeName="stroke-dashoffset" from="0" to="-60" dur={p.dur} repeatCount="indefinite" />
            </path>
            <circle r="4" fill="#FF6B35" opacity="0.85" filter="url(#dotglow)">
              <animateMotion dur={p.dur} repeatCount="indefinite"><mpath href={`#${p.id}`} /></animateMotion>
            </circle>
          </g>
        ))}

        {/* Customer → Center lines (green, reversed) */}
        {[
          { id: 'c1', d: 'M 265 728 C 410 605 560 528 720 435', dur: '2.5s' },
          { id: 'c2', d: 'M 510 755 C 575 635 645 548 720 435', dur: '2.9s' },
          { id: 'c3', d: 'M 930 755 C 865 635 795 548 720 435', dur: '2.3s' },
          { id: 'c4', d: 'M 1175 728 C 1030 605 880 528 720 435', dur: '3s' },
        ].map(p => (
          <g key={p.id}>
            <path id={p.id} d={p.d} fill="none" stroke="url(#gg1)" strokeWidth="1.8" strokeDasharray="9 6">
              <animate attributeName="stroke-dashoffset" from="-60" to="0" dur={p.dur} repeatCount="indefinite" />
            </path>
            <circle r="4" fill="#4CAF50" opacity="0.85" filter="url(#dotglow)">
              <animateMotion dur={p.dur} repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear">
                <mpath href={`#${p.id}`} />
              </animateMotion>
            </circle>
          </g>
        ))}
      </svg>

      {/* ── Outer glow ring (largest) ── */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.07) 0%, transparent 70%)', animation: 'ccPulseRing 5s ease-in-out infinite' }} />

      {/* ── Spinning orbit ring ── */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', width: '460px', height: '460px', borderRadius: '50%', border: '1px dashed rgba(255,107,53,0.18)', animation: 'ccSpinSlow 40s linear infinite', transform: 'translate(-50%, -50%)' }}>
        <div style={{ position: 'absolute', top: '-5px', left: '50%', transform: 'translateX(-50%)', width: '10px', height: '10px', borderRadius: '50%', background: '#FF6B35', boxShadow: '0 0 12px #FF6B35', opacity: 0.7 }} />
      </div>

      {/* ── Inner spinning ring (reverse) ── */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', width: '340px', height: '340px', borderRadius: '50%', border: '1px dashed rgba(76,175,80,0.2)', animation: 'ccSpinRev 30s linear infinite', transform: 'translate(-50%, -50%)' }}>
        <div style={{ position: 'absolute', bottom: '-5px', left: '50%', transform: 'translateX(-50%)', width: '8px', height: '8px', borderRadius: '50%', background: '#4CAF50', boxShadow: '0 0 10px #4CAF50', opacity: 0.7 }} />
      </div>

      {/* ── Central glass circle (behind hero text) ── */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', border: '1px solid rgba(255,107,53,0.15)', boxShadow: '0 20px 80px rgba(255,107,53,0.12), 0 0 0 1px rgba(255,255,255,0.8) inset' }} />

      {/* ── House silhouettes (Chefs) ── */}
      <House top="8%"  left="8%"  icon="👩‍🍳" label="Homemaker"  delay={0}   />
      <House top="2%"  left="41%" icon="🧑‍🍳" label="Young Chef"  delay={0.6} />
      <House top="8%"  left="76%" icon="👴"   label="Grandpa"     delay={1.1} />
      <House top="38%" left="3%"  icon="👵"   label="Grandma"     delay={1.6} />
      <House top="38%" left="85%" icon="🎓"   label="Student"     delay={0.9} />

      {/* ── Customer icons (ordering via phone) ── */}
      <Customer top="76%" left="14%" delay={0}   />
      <Customer top="81%" left="32%" delay={0.7} />
      <Customer top="81%" left="58%" delay={1.3} />
      <Customer top="76%" left="77%" delay={0.4} />

      {/* ── Floating decorative icons ── */}
      {floatingIcons.map(f => (
        <div key={`${f.icon}${f.left}`} style={{ position: 'absolute', top: f.top, left: f.left, fontSize: `${f.size}px`, animation: `ccFloat ${3.2 + f.delay}s ease-in-out ${f.delay}s infinite`, opacity: 0.65, filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.1))' }}>
          {f.icon}
        </div>
      ))}
    </div>
  )
}
