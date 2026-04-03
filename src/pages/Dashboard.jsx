import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../supabaseClient'
import { useAuth } from '../hooks/useAuth'
import Header from '../components/Header'
import MemberCard from '../components/MemberCard'
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

function calcCumplimientoMes(reportes) {
  const now = new Date()
  const mes = reportes.filter(r => {
    const d = new Date(r.fecha)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const dias = now.getDate()
  return Math.round((mes.filter(r => ACTIVITIES.some(a => r[a.key])).length / dias) * 100)
}

export default function Dashboard() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [myReport, setMyReport] = useState(null)

  const todayStr = new Date().toISOString().split('T')[0]
  const todayLabel = new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  useEffect(() => { loadDashboard() }, [])

  async function loadDashboard() {
    setLoading(true)
    try {
      const [{ data: profiles, error: pErr }, { data: reportes, error: rErr }] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('reportes').select('*').order('fecha', { ascending: false }),
      ])
      if (pErr) throw pErr
      if (rErr) throw rErr

      const enriched = profiles.map(p => {
        const ur = reportes.filter(r => r.user_id === p.id)
        return { ...p, streak: calcStreak(ur), cumplimientoMes: calcCumplimientoMes(ur), todayReport: ur.find(r => r.fecha === todayStr) || null }
      })
      enriched.sort((a, b) => b.streak - a.streak)
      setMembers(enriched)
      setMyReport(reportes.find(r => r.user_id === session?.user?.id && r.fecha === todayStr) || null)
    } catch (err) { toast.error('Error: ' + err.message) }
    setLoading(false)
  }

  const myCount = myReport ? ACTIVITIES.filter(a => myReport[a.key]).length : 0

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Header />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Page header */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="flex items-center gap-3 mb-2">
            <div style={{ width: 32, height: 1, background: 'var(--gold-muted)' }} />
            <span className="font-cinzel" style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--text-2)', textTransform: 'uppercase' }}>
              Círculo Privado
            </span>
          </div>
          <h2 className="font-cormorant" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 300, color: 'var(--text)', letterSpacing: '0.04em', margin: 0 }}>
            El Método Troya
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', fontStyle: 'italic', marginTop: '0.4rem', textTransform: 'capitalize' }}>
            {todayLabel}
          </p>
        </div>

        {/* Today's report banner */}
        <div
          style={{
            background: myReport ? 'rgba(184,146,42,0.06)' : 'var(--surface)',
            border: `1px solid ${myReport ? 'rgba(184,146,42,0.25)' : 'var(--border)'}`,
            borderRadius: 2,
            padding: '1.75rem 2rem',
            marginBottom: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p className="font-cinzel" style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--text-2)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              {myReport ? '✓ Reporte completado' : '○ Pendiente'}
            </p>
            <p className="font-cormorant" style={{ fontSize: '1.3rem', fontWeight: 600, color: myReport ? 'var(--text)' : 'var(--text-2)', margin: 0 }}>
              {myReport ? `${myCount} de 5 actividades completadas` : 'Aún no has reportado hoy'}
            </p>
            {myReport && (
              <div className="flex gap-2 mt-2">
                {ACTIVITIES.map(a => (
                  <span key={a.key} style={{ fontSize: '1.1rem', opacity: myReport[a.key] ? 1 : 0.15, filter: myReport[a.key] ? 'none' : 'grayscale(1)' }}>
                    {a.emoji}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => navigate('/reporte')}
            className="btn-gold"
            style={{ padding: '0.75rem 2rem', border: 'none', cursor: 'pointer', borderRadius: 1, whiteSpace: 'nowrap', fontSize: '0.68rem' }}
          >
            {myReport ? 'Editar Reporte' : 'Reportar Hoy'}
          </button>
        </div>

        {/* Team section header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div style={{ width: 1, height: 28, background: 'var(--gold)' }} />
            <div>
              <p className="font-cinzel" style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--text-2)', textTransform: 'uppercase', margin: 0 }}>
                Tabla de Honor
              </p>
              <p className="font-cormorant" style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                El Equipo
              </p>
            </div>
          </div>
          <span className="font-cinzel" style={{ fontSize: '0.6rem', color: 'var(--text-3)', letterSpacing: '0.15em', border: '1px solid var(--border)', padding: '4px 10px' }}>
            {members.length} MIEMBROS
          </span>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ height: 140, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 2, opacity: 0.5 }} />
            ))}
          </div>
        ) : members.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
            <p className="font-cinzel" style={{ fontSize: '0.65rem', letterSpacing: '0.3em', color: 'var(--text-3)', textTransform: 'uppercase' }}>
              El círculo está vacío
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {members.map((m, i) => (
              <MemberCard key={m.id} member={m} rank={i + 1} isCurrentUser={m.id === session?.user?.id} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
