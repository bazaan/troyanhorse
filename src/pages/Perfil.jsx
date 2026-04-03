import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../supabaseClient'
import Header from '../components/Header'
import HeatmapChart from '../components/HeatmapChart'
import { ACTIVITIES } from '../components/ActivityCheckbox'

function calcStreak(reportes) {
  if (!reportes.length) return 0
  const sorted = [...reportes].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  const today = new Date(); today.setHours(0, 0, 0, 0)
  let streak = 0, current = new Date(today)
  for (const r of sorted) {
    const d = new Date(r.fecha); d.setHours(0, 0, 0, 0)
    const diff = (current - d) / (1000 * 60 * 60 * 24)
    if (diff > 1) break
    if (diff < 0) continue
    if (ACTIVITIES.filter(a => r[a.key]).length >= 3) {
      streak++; current = new Date(d); current.setDate(current.getDate() - 1)
    } else break
  }
  return streak
}

function calcMaxStreak(reportes) {
  const valid = [...reportes]
    .filter(r => ACTIVITIES.filter(a => r[a.key]).length >= 3)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
  if (!valid.length) return 0
  let max = 1, current = 1
  for (let i = 1; i < valid.length; i++) {
    const diff = (new Date(valid[i].fecha) - new Date(valid[i-1].fecha)) / (1000*60*60*24)
    if (diff === 1) { current++; max = Math.max(max, current) } else current = 1
  }
  return max
}

export default function Perfil() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [reportes, setReportes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadProfile() }, [userId])

  async function loadProfile() {
    setLoading(true)
    try {
      const [{ data: p, error: pErr }, { data: r, error: rErr }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('reportes').select('*').eq('user_id', userId).order('fecha', { ascending: false }),
      ])
      if (pErr) throw pErr
      if (rErr) throw rErr
      setProfile(p); setReportes(r)
    } catch (err) { toast.error('Error: ' + err.message) }
    setLoading(false)
  }

  const labelStyle = {
    fontSize: '0.6rem',
    fontFamily: 'Cinzel, serif',
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    color: 'var(--text-2)',
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Header />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ height: 120, background: 'var(--surface)', border: '1px solid var(--border)', opacity: 0.4, borderRadius: 2 }} />
        ))}
      </div>
    </div>
  )

  if (!profile) return null

  const yr = new Date().getFullYear()
  const daysOfYear = Math.ceil((new Date() - new Date(yr, 0, 1)) / (1000*60*60*24))
  const diasConAct = reportes.filter(r => ACTIVITIES.some(a => r[a.key])).length
  const cumplimiento = daysOfYear > 0 ? Math.round((diasConAct / daysOfYear) * 100) : 0
  const streakActual = calcStreak(reportes)
  const streakMax = calcMaxStreak(reportes)
  const ultimos30 = reportes.slice(0, 30)
  const pesosRecientes = reportes.filter(r => r.peso).slice(0, 7)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Header />

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Profile hero */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 2,
          padding: '2.5rem',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, right: 0, width: 200, height: 200,
            background: 'radial-gradient(circle at top right, rgba(184,146,42,0.05), transparent 70%)',
            pointerEvents: 'none',
          }}/>

          <div className="flex items-center gap-6">
            <div style={{
              width: 64,
              height: 64,
              border: '1px solid var(--gold-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span className="font-cinzel" style={{ fontSize: '1.5rem', color: 'var(--gold)', fontWeight: 600 }}>
                {profile.nombre?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p style={{ ...labelStyle, marginBottom: '0.35rem' }}>Miembro del Círculo</p>
              <h1 className="font-cormorant" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 400, color: 'var(--text)', margin: 0, letterSpacing: '0.04em' }}>
                {profile.nombre}
              </h1>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-2)', fontStyle: 'italic', marginTop: '0.3rem' }}>
                Desde {new Date(profile.created_at).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            {streakActual > 0 && (
              <div style={{ textAlign: 'right', paddingLeft: '2rem', borderLeft: '1px solid var(--border)' }}>
                <p className="font-cinzel" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--gold)', lineHeight: 1, fontWeight: 700 }}>
                  {streakActual}
                </p>
                <p style={{ ...labelStyle, marginTop: '0.3rem' }}>días en racha</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Días reportados', value: reportes.length },
            { label: 'Cumplimiento anual', value: `${cumplimiento}%` },
            { label: 'Racha máxima', value: streakMax },
            { label: 'Peso actual', value: pesosRecientes[0]?.peso ? `${pesosRecientes[0].peso} kg` : '—' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              padding: '1.5rem', borderRadius: 2, textAlign: 'center',
            }}>
              <p className="font-cormorant" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 600, color: 'var(--text)', margin: 0, letterSpacing: '0.02em' }}>
                {s.value}
              </p>
              <p style={{ ...labelStyle, marginTop: '0.4rem' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Activity breakdown */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          padding: '2rem', marginBottom: '2rem', borderRadius: 2,
        }}>
          <p style={{ ...labelStyle, marginBottom: '1.5rem' }}>Desglose por actividad</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {ACTIVITIES.map(a => {
              const count = reportes.filter(r => r[a.key]).length
              const pct = reportes.length > 0 ? Math.round((count / reportes.length) * 100) : 0
              return (
                <div key={a.key}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: '1.1rem' }}>{a.emoji}</span>
                      <span className="font-cormorant" style={{ fontSize: '1rem', color: 'var(--text)', fontWeight: 400 }}>{a.label}</span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-2)', fontStyle: 'italic' }}>
                      {count} de {reportes.length} días
                    </span>
                  </div>
                  <div style={{ height: 2, background: 'var(--border)' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'var(--gold)', transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Heatmap */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          padding: '2rem', marginBottom: '2rem', borderRadius: 2,
        }}>
          <div className="flex items-center justify-between mb-5">
            <p style={labelStyle}>Actividad {yr}</p>
            <div className="flex items-center gap-2">
              <span style={{ ...labelStyle, marginBottom: 0 }}>menos</span>
              {[0,1,2,3,4,5].map(n => (
                <span key={n} style={{ display: 'inline-block', width: 10, height: 10 }} className={`color-scale-${n}`} />
              ))}
              <span style={{ ...labelStyle, marginBottom: 0 }}>más</span>
            </div>
          </div>
          <HeatmapChart reportes={reportes} />
        </div>

        {/* Last 30 reports */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          padding: '2rem', borderRadius: 2,
        }}>
          <p style={{ ...labelStyle, marginBottom: '1.5rem' }}>Últimos 30 reportes</p>
          {ultimos30.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-3)', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>Sin reportes aún.</p>
          ) : (
            <div>
              {ultimos30.map((r, i) => {
                const count = ACTIVITIES.filter(a => r[a.key]).length
                return (
                  <div key={r.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.85rem 0',
                    borderBottom: i < ultimos30.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--text-2)', minWidth: 90 }}>{r.fecha}</span>
                    <div className="flex gap-1.5 flex-1">
                      {ACTIVITIES.map(a => (
                        <span key={a.key} style={{ fontSize: '1rem', opacity: r[a.key] ? 1 : 0.12, filter: r[a.key] ? 'none' : 'grayscale(1)' }}>
                          {a.emoji}
                        </span>
                      ))}
                    </div>
                    {r.peso && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-2)', fontStyle: 'italic', minWidth: 50 }}>{r.peso} kg</span>
                    )}
                    <span className="font-cinzel" style={{
                      fontSize: '0.6rem',
                      color: count >= 3 ? 'var(--gold)' : 'var(--text-3)',
                      letterSpacing: '0.1em',
                      minWidth: 24,
                      textAlign: 'right',
                    }}>
                      {count}/5
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-2)',
            fontSize: '0.8rem',
            fontStyle: 'italic',
            cursor: 'pointer',
            padding: '1.5rem 0 0',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.target.style.color = 'var(--text)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-2)'}
        >
          ← Volver al dashboard
        </button>
      </main>
    </div>
  )
}
