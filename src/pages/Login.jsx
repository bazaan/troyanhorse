import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../supabaseClient'

export default function Login() {
  const [tab, setTab] = useState('login')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async e => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) toast.error(error.message)
    else navigate('/dashboard')
  }

  const handleRegister = async e => {
    e.preventDefault()
    if (!nombre.trim()) { toast.error('Ingresa tu nombre'); return }
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) { setLoading(false); toast.error(error.message); return }
    if (data.user) {
      const { error: pe } = await supabase.from('profiles').insert({ id: data.user.id, nombre: nombre.trim() })
      if (pe) toast.error('Error creando perfil: ' + pe.message)
      else { toast.success('¡Bienvenido al círculo!'); setTab('login') }
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '0.85rem 1.1rem',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    fontFamily: 'Cormorant Garant, serif',
    fontSize: '1.05rem',
    outline: 'none',
    borderRadius: 1,
    transition: 'border-color 0.2s',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.62rem',
    fontFamily: 'Cinzel, serif',
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    color: 'var(--text-2)',
    marginBottom: '0.5rem',
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--bg)' }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(184,146,42,0.05) 0%, transparent 60%)',
        pointerEvents: 'none',
      }}/>

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

        {/* Header ornament */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold-muted))' }}/>
            <span style={{ fontSize: '1.2rem' }}>⚔</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--gold-muted), transparent)' }}/>
          </div>

          <h1 className="font-cinzel" style={{
            fontSize: 'clamp(2rem, 8vw, 3.2rem)',
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: 'var(--text)',
            lineHeight: 1,
            marginBottom: '0.4rem',
          }}>
            PLAN <span style={{ color: 'var(--gold)' }}>TROYA</span>
          </h1>
          <p style={{
            fontSize: '0.62rem',
            fontFamily: 'Cinzel, serif',
            letterSpacing: '0.35em',
            color: 'var(--text-2)',
            textTransform: 'uppercase',
          }}>
            Alef Company · Método de Manifestación
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          padding: '2.5rem',
        }}>
          {/* Tabs */}
          <div className="flex mb-8" style={{ borderBottom: '1px solid var(--border)', gap: 0 }}>
            {[
              { key: 'login', label: 'Iniciar Sesión' },
              { key: 'register', label: 'Registrarse' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="font-cinzel"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: tab === t.key ? '1px solid var(--gold)' : '1px solid transparent',
                  color: tab === t.key ? 'var(--gold)' : 'var(--text-2)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  marginBottom: -1,
                  transition: 'color 0.2s, border-color 0.2s',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="tu@email.com"
                  onFocus={e => e.target.style.borderColor = 'var(--gold-muted)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <div>
                <label style={labelStyle}>Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="••••••••"
                  onFocus={e => e.target.style.borderColor = 'var(--gold-muted)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-gold"
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  marginTop: '0.5rem',
                  borderRadius: 1,
                  fontSize: '0.7rem',
                }}
              >
                {loading ? 'Ingresando...' : 'Entrar al Círculo'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="Tu nombre"
                  onFocus={e => e.target.style.borderColor = 'var(--gold-muted)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="tu@email.com"
                  onFocus={e => e.target.style.borderColor = 'var(--gold-muted)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <div>
                <label style={labelStyle}>Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={inputStyle}
                  placeholder="Mínimo 6 caracteres"
                  onFocus={e => e.target.style.borderColor = 'var(--gold-muted)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-gold"
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  marginTop: '0.5rem',
                  borderRadius: 1,
                  fontSize: '0.7rem',
                }}
              >
                {loading ? 'Creando cuenta...' : 'Unirme al Círculo'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center font-cinzel" style={{
          fontSize: '0.55rem',
          color: 'var(--text-3)',
          letterSpacing: '0.2em',
          marginTop: '2rem',
          textTransform: 'uppercase',
        }}>
          Alef Company © {new Date().getFullYear()} · Acceso Privado
        </p>
      </div>
    </div>
  )
}
