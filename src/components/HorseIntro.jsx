import { useEffect, useState } from 'react'

function HorseSVG() {
  return (
    <svg viewBox="0 0 700 420" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Main body */}
      <ellipse cx="350" cy="240" rx="175" ry="72"/>
      {/* Chest */}
      <ellipse cx="195" cy="248" rx="70" ry="68"/>
      {/* Hindquarters */}
      <ellipse cx="490" cy="228" rx="75" ry="72"/>
      {/* Lower neck */}
      <path d="M 158 205 C 148 182 147 152 157 128 C 165 108 178 98 192 100 C 206 102 214 118 210 140 C 220 118 225 205 205 225 Z"/>
      {/* Upper neck */}
      <path d="M 162 122 C 158 98 160 70 170 52 C 178 36 192 28 204 34 C 216 40 220 58 215 78 C 210 95 200 112 190 125 Z"/>
      {/* Head */}
      <ellipse cx="152" cy="46" rx="38" ry="22" transform="rotate(-20 152 46)"/>
      {/* Muzzle */}
      <ellipse cx="118" cy="62" rx="25" ry="16" transform="rotate(-12 118 62)"/>
      {/* Ear */}
      <polygon points="170,30 176,14 183,30"/>
      {/* Front leg forward */}
      <path d="M 155 312 C 137 352 122 390 116 420 L 136 420 C 143 392 158 354 178 315 Z"/>
      {/* Front leg stance */}
      <path d="M 215 314 C 220 357 222 390 222 420 L 242 420 C 242 390 242 356 240 315 Z"/>
      {/* Hind leg back */}
      <path d="M 535 302 C 558 342 572 382 578 420 L 598 420 C 592 380 578 340 558 300 Z"/>
      {/* Hind leg forward */}
      <path d="M 488 305 C 488 348 492 386 494 420 L 514 420 C 512 386 510 348 512 307 Z"/>
      {/* Tail body */}
      <path d="M 562 210 C 590 188 618 192 625 212 C 628 228 618 245 600 248 C 580 252 560 240 555 225 Z"/>
      {/* Tail strands */}
      <path d="M 568 215 C 595 200 620 205 626 220" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M 565 225 C 592 215 618 220 625 235" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M 562 235 C 588 228 612 233 618 248" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Mane */}
      <path d="M 188 38 C 192 58 196 82 198 112" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round"/>
      <path d="M 196 36 C 200 55 204 80 206 110" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <path d="M 204 40 C 207 58 210 82 211 108" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

export default function HorseIntro({ onComplete }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const already = sessionStorage.getItem('pt_intro_shown')
    if (already) { setVisible(false); onComplete?.(); return }

    const timer = setTimeout(() => {
      sessionStorage.setItem('pt_intro_shown', '1')
      setVisible(false)
      onComplete?.()
    }, 4400)

    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div
      className="intro-fade fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(184,146,42,0.06) 0%, transparent 70%)'
        }}
      />

      {/* Top decorative line */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <div style={{ width: 80, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
        <div style={{ width: 4, height: 4, background: 'var(--gold)', borderRadius: '50%' }} />
        <div style={{ width: 80, height: 1, background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
      </div>

      {/* Center content */}
      <div className="text-center relative z-10" style={{ animationDelay: '0.2s' }}>
        <p
          className="font-cinzel fade-up"
          style={{
            color: 'var(--text-2)',
            fontSize: '0.65rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            animationDelay: '0.3s',
            opacity: 0,
          }}
        >
          Alef Company
        </p>
        <h1
          className="font-cinzel text-shimmer fade-up"
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
            fontWeight: 700,
            letterSpacing: '0.18em',
            lineHeight: 1,
            marginBottom: '0.5rem',
            animationDelay: '0.5s',
            opacity: 0,
          }}
        >
          PLAN TROYA
        </h1>
        <p
          className="fade-up"
          style={{
            color: 'var(--text-2)',
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            fontFamily: 'Cinzel, serif',
            animationDelay: '0.8s',
            opacity: 0,
          }}
        >
          Método de Manifestación
        </p>
      </div>

      {/* Horse running across */}
      <div
        className="horse-run absolute"
        style={{ bottom: '8%', width: 'clamp(280px, 42vw, 580px)', height: 'auto' }}
      >
        <div className="horse-bob" style={{ color: 'var(--gold)' }}>
          <HorseSVG />
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <div style={{ width: 80, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
        <div style={{ width: 4, height: 4, background: 'var(--gold)', borderRadius: '50%' }} />
        <div style={{ width: 80, height: 1, background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
      </div>
    </div>
  )
}
