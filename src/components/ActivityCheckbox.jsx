const ACTIVITIES = [
  { key: 'meditacion',    label: 'Meditación',    emoji: '🧘', desc: 'Mindfulness o meditación' },
  { key: 'entrenamiento', label: 'Entrenamiento',  emoji: '💪', desc: 'Gym o ejercicio de fuerza' },
  { key: 'correr',        label: 'Correr',          emoji: '🏃', desc: 'Cardio o running' },
  { key: 'lectura',       label: 'Lectura',         emoji: '📚', desc: 'Leer al menos 10 minutos' },
  { key: 'ayuno',         label: 'Ayuno',           emoji: '⚡', desc: 'Ayuno intermitente' },
]

export { ACTIVITIES }

export default function ActivityCheckbox({ activityKey, checked, onChange }) {
  const activity = ACTIVITIES.find(a => a.key === activityKey)
  if (!activity) return null

  return (
    <label
      className="flex items-center gap-4 px-5 py-4 cursor-pointer transition-all"
      style={{
        background: checked ? 'rgba(184,146,42,0.07)' : 'var(--surface)',
        border: `1px solid ${checked ? 'rgba(184,146,42,0.35)' : 'var(--border)'}`,
        borderRadius: 2,
        userSelect: 'none',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(activityKey, e.target.checked)}
        className="sr-only"
      />

      <span style={{ fontSize: '1.5rem', minWidth: 32 }}>{activity.emoji}</span>

      <div className="flex-1">
        <p className="font-cormorant" style={{
          fontSize: '1.1rem',
          fontWeight: 600,
          color: checked ? 'var(--text)' : 'rgba(237,232,222,0.65)',
          letterSpacing: '0.02em',
        }}>
          {activity.label}
        </p>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-2)', fontStyle: 'italic' }}>
          {activity.desc}
        </p>
      </div>

      <div
        style={{
          width: 22,
          height: 22,
          border: `1px solid ${checked ? 'var(--gold)' : 'var(--border-2)'}`,
          background: checked ? 'var(--gold)' : 'transparent',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          flexShrink: 0,
        }}
      >
        {checked && (
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
            <path d="M1 4L4.5 7.5L11 1" stroke="#0a0900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </label>
  )
}
