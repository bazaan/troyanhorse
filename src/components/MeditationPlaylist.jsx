import { useState } from 'react'

const PLAYLISTS = [
  {
    id: 1,
    title: 'Deep Focus',
    desc: 'Binaural beats · 432 Hz',
    duration: '3 h',
    emoji: '🎵',
    url: 'https://www.youtube.com/watch?v=WPni755-Krg',
    type: 'YouTube'
  },
  {
    id: 2,
    title: 'Morning Stillness',
    desc: 'Tibetan bowls · Sunrise',
    duration: '1 h',
    emoji: '🔔',
    url: 'https://www.youtube.com/watch?v=1ZYbU82GVz4',
    type: 'YouTube'
  },
  {
    id: 3,
    title: 'Dark Forest',
    desc: 'Nature sounds · Night',
    duration: '2 h',
    emoji: '🌿',
    url: 'https://www.youtube.com/watch?v=xNN7iTA57jM',
    type: 'YouTube'
  },
  {
    id: 4,
    title: 'Zen Master',
    desc: 'Guided meditation',
    duration: '30 min',
    emoji: '🧘',
    url: 'https://www.youtube.com/watch?v=O-6f5wQXSu8',
    type: 'YouTube'
  },
  {
    id: 5,
    title: 'Cosmos',
    desc: 'Space ambient · Deep',
    duration: '4 h',
    emoji: '✨',
    url: 'https://www.youtube.com/watch?v=ZToicYcHIOU',
    type: 'YouTube'
  },
  {
    id: 6,
    title: 'Ancient Rain',
    desc: 'Rain + thunder · Relax',
    duration: '8 h',
    emoji: '🌧️',
    url: 'https://www.youtube.com/watch?v=mPZkdNFkNps',
    type: 'YouTube'
  },
]

export default function MeditationPlaylist() {
  const [open, setOpen] = useState(false)

  return (
    <div className="card" style={{ borderRadius: 2, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-5 transition-colors"
        style={{ color: 'var(--text)' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,146,42,0.04)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div className="flex items-center gap-4">
          <span style={{ color: 'var(--gold)', fontSize: '1.2rem' }}>♪</span>
          <div className="text-left">
            <p className="font-cinzel" style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--text-2)', textTransform: 'uppercase' }}>
              Playlist de
            </p>
            <p className="font-cormorant" style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text)', letterSpacing: '0.02em' }}>
              Meditación
            </p>
          </div>
        </div>
        <span
          style={{
            color: 'var(--gold)',
            fontSize: '0.8rem',
            transition: 'transform 0.3s',
            display: 'inline-block',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        >
          ▼
        </span>
      </button>

      {open && (
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            {PLAYLISTS.map((pl, i) => (
              <a
                key={pl.id}
                href={pl.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 px-6 py-4 transition-all group"
                style={{
                  borderBottom: i < PLAYLISTS.length - 2 ? '1px solid var(--border)' : 'none',
                  textDecoration: 'none',
                  borderRight: i % 2 === 0 ? '1px solid var(--border)' : 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,146,42,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '1.4rem', minWidth: 28 }}>{pl.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-cormorant" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)' }}>
                    {pl.title}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-2)', fontStyle: 'italic' }}>
                    {pl.desc}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p style={{ fontSize: '0.72rem', color: 'var(--gold)', fontFamily: 'Cinzel, serif', letterSpacing: '0.05em' }}>
                    {pl.duration}
                  </p>
                  <p style={{ fontSize: '0.62rem', color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {pl.type}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
