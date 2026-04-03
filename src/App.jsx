import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'
import HorseIntro from './components/HorseIntro'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Reporte from './pages/Reporte'
import Perfil from './pages/Perfil'

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()
  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span className="font-cinzel text-shimmer" style={{ fontSize: '0.8rem', letterSpacing: '0.3em' }}>
        PLAN TROYA
      </span>
    </div>
  )
  if (!session) return <Navigate to="/login" replace />
  return children
}

function PublicRoute({ children }) {
  const { session, loading } = useAuth()
  if (loading) return null
  if (session) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <HorseIntro />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            fontFamily: 'Cormorant Garant, serif',
            fontSize: '0.95rem',
            borderRadius: 2,
            padding: '0.75rem 1.25rem',
          },
          success: { iconTheme: { primary: '#b8922a', secondary: '#0a0900' } },
          error:   { iconTheme: { primary: '#9b2020', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/login"          element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/dashboard"      element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/reporte"        element={<ProtectedRoute><Reporte /></ProtectedRoute>} />
        <Route path="/perfil/:userId" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        <Route path="*"               element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
