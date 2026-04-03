import { useNavigate } from 'react-router-dom'
import { ACTIVITIES } from './ActivityCheckbox'

export default function MemberCard({ member, rank, isCurrentUser }) {
  const navigate = useNavigate()
  const todayReport = member.todayReport
  const activitiesHoy = ACTIVITIES.filter(a => todayReport?.[a.key]).length

  const isTop = rank <= 3
  const rankLabel = rank === 1 ? 'I' : rank === 2 ? 'II' : rank === 3 ? 'III' : rank

  return (
    <div
      className="card card-hover cursor-pointer"
      style={{
        borderRadius: 2,
        padding: '1.5rem',
        borderColor: isCurrentUser ? 'rgba(184,146,42,0.3)' : undefined,
        background: isCurrentUser ? 'rgba(184,146,42,0.03)' : undefined,
      }}
      onClick={() => navigate(`/perfil/${member.id}`)}
    >
      {/* Rank + Name row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {/* Rank */}
          <div style={{
            width: 28,
            height: 28,
            border: `1px solid ${isTop ? 'var(--gold-muted)' : 'var(--border)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span className="font-cinzel" style={{
              fontSize: '0.6rem',
              color: isTop ? 'var(--gold)' : 'var(--text-2)',
              fontWeight: 600,
            }}>
              {rankLabel}
            </span>
          </div>
          {/* Avatar */}
          <div style={{
            width: 36,
            height: 36,
            border: `1px solid ${isCurrentUser ? 'var(--gold)' : 'var(--border-2)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            background: 'var(--bg)',
          }}>
            <span className="font-cinzel" style={{
              fontSize: '0.75rem',
              color: isCurrentUser ? 'var(--gold)' : 'var(--text-2)',
              fontWeight: 600,
            }}>
              {member.nombre?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          {/* Name */}
          <div>
            <p className="font-cormorant" style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', letterSpacing: '0.02em' }}>
              {member.nombre}
              {isCurrentUser && <span style={{ color: 'var(--gold)', fontSize: '0.7rem', marginLeft: 6, fontFamily: 'Cinzel, serif', letterSpacing: '0.1em' }}>· tú</span>}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-2)', fontStyle: 'italic' }}>
              {member.cumplimientoMes}% este mes
            </p>
          </div>
        </div>

        {/* Streak */}
        <div className="text-right">
          <p className="font-cinzel" style={{ fontSize: '1.5rem', color: 'var(--gold)', lineHeight: 1, fontWeight: 600 }}>
            {member.streak}
          </p>
          <p style={{ fontSize: '0.6rem', color: 'var(--text-2)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            días
          </p>
        </div>
      </div>

      {/* Gold divider */}
      <div style={{ height: 1, background: 'var(--border)', marginBottom: '1rem' }} />

      {/* Activities */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {ACTIVITIES.map(a => (
            <span
              key={a.key}
              title={a.label}
              style={{
                fontSize: '1.1rem',
                opacity: todayReport?.[a.key] ? 1 : 0.15,
                filter: todayReport?.[a.key] ? 'none' : 'grayscale(1)',
              }}
            >
              {a.emoji}
            </span>
          ))}
        </div>
        {todayReport ? (
          <span className="font-cinzel" style={{
            fontSize: '0.62rem',
            color: activitiesHoy >= 3 ? 'var(--gold)' : 'var(--text-2)',
            letterSpacing: '0.1em',
            padding: '3px 8px',
            border: `1px solid ${activitiesHoy >= 3 ? 'var(--gold-muted)' : 'var(--border)'}`,
          }}>
            {activitiesHoy}/5
          </span>
        ) : (
          <span style={{ fontSize: '0.68rem', color: 'var(--text-3)', fontStyle: 'italic' }}>sin reporte</span>
        )}
      </div>
    </div>
  )
}
