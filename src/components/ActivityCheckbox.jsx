import { useRef } from 'react'

const ACTIVITIES = [
  { key: 'meditacion',    label: 'Meditación',    emoji: '🧘', desc: 'Mindfulness o meditación', hasPhoto: true },
  { key: 'correr',        label: 'Correr',          emoji: '🏃', desc: 'Cardio o running',          hasPhoto: true },
  { key: 'entrenamiento', label: 'Gym',              emoji: '💪', desc: 'Ejercicio de fuerza',       hasPhoto: true },
  { key: 'lectura',       label: 'Lectura',         emoji: '📚', desc: 'Leer al menos 10 minutos',  hasPhoto: false },
  { key: 'ayuno',         label: 'Ayuno',           emoji: '⚡', desc: 'Ayuno intermitente',        hasPhoto: false },
]

export { ACTIVITIES }

export default function ActivityCheckbox({ activityKey, checked, onChange, photoUrl, onPhotoChange, uploading }) {
  const activity = ACTIVITIES.find(a => a.key === activityKey)
  const fileRef = useRef()
  if (!activity) return null

  return (
    <div style={{
      background: checked ? 'rgba(184,146,42,0.07)' : 'var(--surface)',
      border: `1px solid ${checked ? 'rgba(184,146,42,0.35)' : 'var(--border)'}`,
      borderRadius: 2,
      overflow: 'hidden',
      transition: 'border-color 0.2s, background 0.2s',
    }}>
      {/* Main row */}
      <label className="flex items-center gap-4 px-5 py-4 cursor-pointer" style={{ userSelect: 'none' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(activityKey, e.target.checked)}
          className="sr-only"
        />
        <span style={{ fontSize: '1.5rem', minWidth: 32 }}>{activity.emoji}</span>
        <div className="flex-1">
          <p className="font-cormorant" style={{
            fontSize: '1.1rem', fontWeight: 600,
            color: checked ? 'var(--text)' : 'rgba(237,232,222,0.55)',
            letterSpacing: '0.02em',
          }}>
            {activity.label}
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-2)', fontStyle: 'italic' }}>
            {activity.desc}
          </p>
        </div>
        <div style={{
          width: 22, height: 22,
          border: `1px solid ${checked ? 'var(--gold)' : 'var(--border-2)'}`,
          background: checked ? 'var(--gold)' : 'transparent',
          borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s', flexShrink: 0,
        }}>
          {checked && (
            <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
              <path d="M1 4L4.5 7.5L11 1" stroke="#0a0900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </label>

      {/* Photo upload — only for main 3 activities when checked */}
      {activity.hasPhoto && checked && (
        <div style={{ borderTop: '1px solid rgba(184,146,42,0.15)', padding: '0.75rem 1.25rem' }}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={e => onPhotoChange && onPhotoChange(activityKey, e.target.files[0])}
          />
          {photoUrl ? (
            <div className="flex items-center gap-3">
              <img
                src={photoUrl}
                alt="prueba"
                style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 2, border: '1px solid var(--gold-muted)' }}
              />
              <div className="flex-1">
                <p style={{ fontSize: '0.72rem', color: 'var(--gold)', fontFamily: 'Cinzel, serif', letterSpacing: '0.1em' }}>
                  ✓ DOCUMENTADO
                </p>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  style={{ fontSize: '0.7rem', color: 'var(--text-2)', fontStyle: 'italic', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Cambiar foto
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2"
              style={{
                background: 'none', border: '1px dashed var(--border-2)',
                color: 'var(--text-2)', cursor: 'pointer', padding: '0.5rem 1rem',
                fontSize: '0.72rem', fontFamily: 'Cinzel, serif', letterSpacing: '0.12em',
                textTransform: 'uppercase', borderRadius: 1, width: '100%', justifyContent: 'center',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold-muted)'; e.currentTarget.style.color = 'var(--text)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.color = 'var(--text-2)' }}
            >
              <span>{uploading ? '⏳' : '📸'}</span>
              {uploading ? 'Subiendo...' : 'Agregar prueba'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
