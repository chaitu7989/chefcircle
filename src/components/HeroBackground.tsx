'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const PARTICLES = [
  { id: 0,  x: 8,  y: 20, s: 2.5, d: 7.2, dl: 0,   c: '#FF6B35' },
  { id: 1,  x: 91, y: 26, s: 2,   d: 9.1, dl: 1.4, c: '#FBBF24' },
  { id: 2,  x: 21, y: 71, s: 2,   d: 6.8, dl: 0.8, c: 'rgba(255,248,242,0.6)' },
  { id: 3,  x: 77, y: 64, s: 3,   d: 8.4, dl: 2.2, c: '#FF6B35' },
  { id: 4,  x: 44, y: 13, s: 2,   d: 10,  dl: 0.5, c: '#FBBF24' },
  { id: 5,  x: 56, y: 87, s: 2,   d: 7.6, dl: 1.8, c: 'rgba(255,248,242,0.4)' },
  { id: 6,  x: 31, y: 46, s: 1.5, d: 8.9, dl: 3,   c: '#FF6B35' },
  { id: 7,  x: 69, y: 39, s: 2.5, d: 6.5, dl: 0.2, c: '#FBBF24' },
  { id: 8,  x: 16, y: 56, s: 2,   d: 9.5, dl: 2.6, c: '#FF6B35' },
  { id: 9,  x: 84, y: 79, s: 1.5, d: 7.8, dl: 1.1, c: 'rgba(255,248,242,0.5)' },
  { id: 10, x: 59, y: 23, s: 3,   d: 8.2, dl: 0.6, c: '#FF6B35' },
  { id: 11, x: 37, y: 77, s: 2,   d: 7.4, dl: 3.2, c: '#FBBF24' },
  { id: 12, x: 26, y: 31, s: 1.5, d: 9.8, dl: 1.9, c: '#FF6B35' },
  { id: 13, x: 64, y: 51, s: 2,   d: 6.2, dl: 2.8, c: 'rgba(255,248,242,0.4)' },
  { id: 14, x: 49, y: 67, s: 2.5, d: 8.6, dl: 0.4, c: '#FBBF24' },
  { id: 15, x: 13, y: 83, s: 2,   d: 7.0, dl: 1.3, c: '#FF6B35' },
  { id: 16, x: 87, y: 43, s: 1.5, d: 9.3, dl: 2.0, c: '#FBBF24' },
  { id: 17, x: 41, y: 57, s: 3,   d: 8.0, dl: 0.7, c: '#FF6B35' },
  { id: 18, x: 73, y: 15, s: 2,   d: 7.5, dl: 3.5, c: 'rgba(255,248,242,0.5)' },
  { id: 19, x: 34, y: 91, s: 2.5, d: 6.9, dl: 1.6, c: '#FBBF24' },
]

const ORBS = [
  { x: '10%',  y: '18%', w: 130, h: 90,  c: 'rgba(255,107,53,0.18)',  blur: 45, dy: 22,  dx: 10,  dur: 7  },
  { x: '80%',  y: '10%', w: 100, h: 100, c: 'rgba(251,191,36,0.12)',  blur: 40, dy: -18, dx: 8,   dur: 9  },
  { x: '84%',  y: '66%', w: 150, h: 110, c: 'rgba(255,107,53,0.12)',  blur: 55, dy: 16,  dx: -14, dur: 8  },
  { x: '3%',   y: '60%', w: 90,  h: 90,  c: 'rgba(255,140,80,0.14)',  blur: 35, dy: -22, dx: 12,  dur: 6  },
  { x: '46%',  y: '78%', w: 200, h: 70,  c: 'rgba(255,107,53,0.08)',  blur: 65, dy: 12,  dx: 0,   dur: 11 },
  { x: '35%',  y: '5%',  w: 80,  h: 60,  c: 'rgba(251,191,36,0.10)', blur: 30, dy: 18,  dx: -8,  dur: 8  },
]

export default function HeroBackground() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>

      {/* ── Warm center emanation ── */}
      <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', width: '900px', height: '700px', background: 'radial-gradient(ellipse, rgba(255,107,53,0.1) 0%, rgba(255,107,53,0.04) 40%, transparent 70%)', borderRadius: '50%' }} />

      {/* ── Outer orbit ring ── */}
      <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
        <motion.div
          style={{ width: '660px', height: '660px', marginLeft: '-330px', marginTop: '-330px', borderRadius: '50%', border: '1px solid rgba(255,107,53,0.07)', position: 'relative' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        >
          <div style={{ position: 'absolute', top: '-4px', left: '50%', transform: 'translateX(-50%)', width: '8px', height: '8px', borderRadius: '50%', background: '#FF6B35', boxShadow: '0 0 10px #FF6B35, 0 0 22px rgba(255,107,53,0.5)' }} />
        </motion.div>
      </div>

      {/* ── Middle orbit ring ── */}
      <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
        <motion.div
          style={{ width: '450px', height: '450px', marginLeft: '-225px', marginTop: '-225px', borderRadius: '50%', border: '1px solid rgba(255,107,53,0.10)', position: 'relative' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        >
          <div style={{ position: 'absolute', bottom: '-3px', right: '15%', width: '6px', height: '6px', borderRadius: '50%', background: '#FBBF24', boxShadow: '0 0 8px #FBBF24' }} />
        </motion.div>
      </div>

      {/* ── Inner orbit ring ── */}
      <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
        <motion.div
          style={{ width: '270px', height: '270px', marginLeft: '-135px', marginTop: '-135px', borderRadius: '50%', border: '1px solid rgba(255,107,53,0.16)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* ── Atmospheric glowing orbs ── */}
      {ORBS.map((o, i) => (
        <motion.div
          key={i}
          style={{ position: 'absolute', left: o.x, top: o.y, width: `${o.w}px`, height: `${o.h}px`, background: o.c, borderRadius: '50%', filter: `blur(${o.blur}px)` }}
          animate={{ y: [0, o.dy, 0], x: [0, o.dx, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: o.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        />
      ))}

      {/* ── Soft particles ── */}
      {mounted && PARTICLES.map(p => (
        <motion.div
          key={p.id}
          style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: `${p.s}px`, height: `${p.s}px`, borderRadius: '50%', background: p.c }}
          animate={{ y: [-12, 12, -12], x: [-6, 6, -6], opacity: [0.25, 0.7, 0.25] }}
          transition={{ duration: p.d, delay: p.dl, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Bottom blend ── */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: 'linear-gradient(to bottom, transparent, rgba(17,24,39,0.4))' }} />
    </div>
  )
}
