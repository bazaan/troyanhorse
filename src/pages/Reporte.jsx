import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../supabaseClient'
import { useAuth } from '../hooks/useAuth'
import Header from '../components/Header'
import ActivityCheckbox, { ACTIVITIES } from '../components/ActivityCheckbox'
import MeditationPlaylist from '../components/MeditationPlaylist'

const PHOTO_KEYS = ['meditacion', 'correr', 'entrenamiento']

export default function Reporte() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState({})
  const [notas, setNotas] = useState('')
  const [peso, setPeso] = useState('')
  const [altura, setAltura] = useState('')
  const [activities, setActivities] = useState({
    meditacion: false, entrenamiento: false, correr: false, lectura: false, ayuno: false,
  })
  const [fotos, setFotos] = useState({
    meditacion_foto: null, entrenamiento_foto: null, correr_foto: null,
  })

  const todayStr = new Date().toISOString().split('T')[0]
  const todayLabel = new Date().toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  useEffect(() => { loadExisting() }, [])

  async function loadExisting() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('reportes').select('*')
        .eq('user_id', session.user.id).eq('fecha', todayStr)
        .maybeSingle()
      if (error) throw error
      if (data) {
        setActivities({ meditacion: !!data.meditacion, entrenamiento: !!data.entrenamiento, correr: !!data.correr, lectura: !!data.lectura, ayuno: !!data.ayuno })
        setNotas(data.notas || '')
        setPeso(data.peso ? String(data.peso) : '')
        setAltura(data.altura ? String(data.altura) : '')
        setFotos({
          meditacion_foto: data.meditacion_foto || null,
          entrenamiento_foto: data.entrenamiento_foto || null,
          correr_foto: data.correr_foto || null,
        })
      }
    } catch (err) {
      console.error('loadExisting error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key, value) => {
    setActivities(prev => ({ ...prev, [key]: value }))
    // Clear photo if unchecked
    if (!value && PHOTO_KEYS.includes(key)) {
      setFotos(prev => ({ ...prev, [`${key}_foto`]: null }))
    }
  }

  const handlePhotoChange = async (activityKey, file) => {
    if (!file) return
    setUploading(prev => ({ ...prev, [activityKey]: true }))
    try {
      const ext = file.name.split('.').pop()
      const path = `${session.user.id}/${todayStr}/${activityKey}.${ext}`
      const { error } = await supabase.storage
        .from('documentacion')
        .upload(path, file, { upsert: true })
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage
        .from('documentacion')
        .getPublicUrl(path)
      setFotos(prev => ({ ...prev, [`${activityKey}_foto`]: publicUrl }))
      toast.success('Foto subida')
    } catch (err) {
      toast.error('Error subiendo foto: ' + err.message)
    }
    setUploading(prev => ({ ...prev, [activityKey]: false }))
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase.from('reportes').upsert(
      {
        user_id: session.user.id,
        fecha: todayStr,
        ...activities,
        ...fotos,
        notas: notas.trim() || null,
        peso: peso ? parseFloat(peso) : null,
        altura: altura ? parseFloat(altura) : null,
      },
      { onConflict: 'user_id,fecha' }
    )
    setSaving(false)
    if (error) toast.error('Error guardando: ' + error.message)
    else { toast.success('Reporte guardado'); navigate('/dashboard') }
  }

  const completadas = Object.values(activities).filter(Boolean).length
  const documentadas = PHOTO_KEYS.filter(k => activities[k] && fotos[`${k}_foto`]).length
  const mainCompleted = PHOTO_KEYS.filter(k => activities[k]).length

  const inputStyle = {
    width: '100%', padding: '0.85rem 1.1rem',
    background: 'var(--bg)', border: '1px solid var(--border)',
    color: 'var(--text)', fontFamily: 'Cormorant Garant, serif',
    fontSize: '1.05rem', outline: 'none', borderRadius: 1, transition: 'border-color 0.2s',
  }
  const labelStyle = {
    display: 'block', fontSize: '0.6rem', fontFamily: 'Cinzel, serif',
    letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-2)', marginBottom: '0.5rem',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Header />
      <main style={{ maxWidth: 620, margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="flex items-center gap-3 mb-2">
            <div style={{ width: 32, height: 1, background: 'var(--gold-muted)' }} />
            <span className="font-cinzel" style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--text-2)', textTransform: 'uppercase' }}>
              Check-in diario
            </span>
          </div>
          <h2 className="font-cormorant" style={{ fontSize: '2.2rem', fontWeight: 300, color: 'var(--text)', margin: 0 }}>
            Reporte del Día
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', fontStyle: 'italic', marginTop: '0.3rem', textTransform: 'capitalize' }}>
            {todayLabel}
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ height: 80, background: 'var(--surface)', border: '1px solid var(--border)', opacity: 0.5, borderRadius: 2 }} />
            ))}
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <div style={{
              background: 'var(--surface)', border: `1px solid ${completadas >= 3 ? 'rgba(184,146,42,0.3)' : 'var(--border)'}`,
              padding: '1.25rem 1.5rem', marginBottom: '2rem', borderRadius: 2,
            }}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-cinzel" style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--text-2)', textTransform: 'uppercase' }}>
                  Actividades
                </span>
                <div className="flex items-center gap-3">
                  {documentadas > 0 && (
                    <span style={{ fontSize: '0.65rem', color: 'var(--gold)', fontStyle: 'italic' }}>
                      📸 {documentadas} documentada{documentadas > 1 ? 's' : ''}
                    </span>
                  )}
                  <span className="font-cinzel" style={{ fontSize: '0.75rem', fontWeight: 600, color: completadas >= 3 ? 'var(--gold)' : 'var(--text-2)', letterSpacing: '0.1em' }}>
                    {completadas} / 5
                  </span>
                </div>
              </div>
              <div style={{ height: 2, background: 'var(--border)' }}>
                <div style={{ height: '100%', width: `${(completadas / 5) * 100}%`, background: completadas >= 3 ? 'var(--gold)' : 'var(--border-2)', transition: 'width 0.4s ease' }} />
              </div>
              {completadas >= 3 && (
                <p style={{ fontSize: '0.72rem', color: 'var(--gold)', fontStyle: 'italic', marginTop: '0.6rem', opacity: 0.8 }}>
                  Racha activa — umbral superado
                </p>
              )}
            </div>

            {/* Actividades principales con foto */}
            <div style={{ marginBottom: '0.5rem' }}>
              <p className="font-cinzel" style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--text-2)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Actividades principales
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {ACTIVITIES.filter(a => a.hasPhoto).map(a => (
                <ActivityCheckbox
                  key={a.key}
                  activityKey={a.key}
                  checked={activities[a.key]}
                  onChange={handleChange}
                  photoUrl={fotos[`${a.key}_foto`]}
                  onPhotoChange={handlePhotoChange}
                  uploading={uploading[a.key]}
                />
              ))}
            </div>

            {/* Actividades secundarias */}
            <div style={{ marginBottom: '0.5rem' }}>
              <p className="font-cinzel" style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--text-2)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Hábitos del día
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
              {ACTIVITIES.filter(a => !a.hasPhoto).map(a => (
                <ActivityCheckbox
                  key={a.key}
                  activityKey={a.key}
                  checked={activities[a.key]}
                  onChange={handleChange}
                />
              ))}
            </div>

            {/* Playlist meditación */}
            <div style={{ marginBottom: '2rem' }}>
              <MeditationPlaylist />
            </div>

            {/* Métricas */}
            <div style={{ marginBottom: '2rem' }}>
              <p style={labelStyle}>Métricas corporales</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={labelStyle}>Peso (kg)</label>
                  <input type="number" step="0.1" min="30" max="300" value={peso}
                    onChange={e => setPeso(e.target.value)} style={inputStyle} placeholder="75.5"
                    onFocus={e => e.target.style.borderColor = 'var(--gold-muted)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                </div>
                <div>
                  <label style={labelStyle}>Altura (cm)</label>
                  <input type="number" step="1" min="100" max="250" value={altura}
                    onChange={e => setAltura(e.target.value)} style={inputStyle} placeholder="178"
                    onFocus={e => e.target.style.borderColor = 'var(--gold-muted)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                </div>
              </div>
              {peso && altura && (
                <p style={{ fontSize: '0.78rem', color: 'var(--text-2)', fontStyle: 'italic', marginTop: '0.5rem' }}>
                  IMC: <span style={{ color: 'var(--text)' }}>{(parseFloat(peso) / Math.pow(parseFloat(altura) / 100, 2)).toFixed(1)}</span>
                </p>
              )}
            </div>

            {/* Notas */}
            <div style={{ marginBottom: '2.5rem' }}>
              <label style={labelStyle}>Notas del día</label>
              <textarea value={notas} onChange={e => setNotas(e.target.value)} rows={3}
                style={{ ...inputStyle, resize: 'none', fontStyle: notas ? 'normal' : 'italic' }}
                placeholder="Reflexiones, logros, obstáculos..."
                onFocus={e => e.target.style.borderColor = 'var(--gold-muted)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>

            <button
              onClick={handleSave}
              disabled={saving || Object.values(uploading).some(Boolean)}
              className="btn-gold"
              style={{ width: '100%', padding: '1.1rem', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1, borderRadius: 1, fontSize: '0.72rem' }}
            >
              {saving ? 'Guardando...' : 'Guardar Reporte'}
            </button>
          </>
        )}
      </main>
    </div>
  )
}
