import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Header() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <header style={{
      background: 'rgba(8,7,11,0.92)',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        <div className="flex items-center justify-between" style={{ height: 64 }}>
          {/* Logo */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 group"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                border: '1px solid var(--gold-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                transition: 'border-color 0.2s',
              }}
              className="group-hover:border-gold"
            >
              ⚔
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="font-cinzel" style={{
                color: 'var(--text)',
                fontSize: '0.82rem',
                letterSpacing: '0.22em',
                fontWeight: 600,
                transition: 'color 0.2s',
              }}>
                PLAN <span style={{ color: 'var(--gold)' }}>TROYA</span>
              </span>
            </div>
          </button>

          {/* Right side */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/reporte')}
              className="btn-gold hidden sm:block"
              style={{
                padding: '0.45rem 1.2rem',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                border: 'none',
                cursor: 'pointer',
                borderRadius: 1,
              }}
            >
              Reportar Hoy
            </button>
            <button
              onClick={handleSignOut}
              style={{
                background: 'none',
                border: '1px solid var(--border)',
                color: 'var(--text-2)',
                fontSize: '0.65rem',
                letterSpacing: '0.18em',
                fontFamily: 'Cinzel, serif',
                textTransform: 'uppercase',
                padding: '0.45rem 1rem',
                cursor: 'pointer',
                borderRadius: 1,
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.target.style.borderColor = 'var(--border-2)'; e.target.style.color = 'var(--text)' }}
              onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-2)' }}
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
