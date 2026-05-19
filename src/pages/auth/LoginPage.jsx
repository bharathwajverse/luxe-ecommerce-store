import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { C } from '../../constants/theme'

const inputStyle = {
  width: '100%',
  padding: '16px 20px',
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 14,
  color: '#fff',
  fontSize: 16,
  outline: 'none',
  transition: 'all 0.3s ease',
  boxSizing: 'border-box',
}

const labelStyle = {
  display: 'block',
  color: 'rgba(255,255,255,0.75)',
  fontSize: 12,
  fontWeight: 700,
  marginBottom: 8,
  textTransform: 'uppercase',
  letterSpacing: 1.2,
}

export default function LoginPage() {
  // Local state for credentials and form status
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Context and navigation hooks
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Determine where to redirect the user after a successful login.
  // Defaults to the home page ('/') if no specific return path exists.
  const rawFrom = location.state?.from
  const from = typeof rawFrom === 'string' ? rawFrom : rawFrom?.pathname || '/'

  /**
   * Handles the login form submission.
   * On success: Redirects to the intended page.
   * If email not found: Redirects to registration with pre-filled email.
   * On error: Shows an error message.
   */
  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = login(email.trim().toLowerCase(), password)
      if (result.success) {
        // Logged in successfully
        navigate(from, { replace: true })
      } else if (result.notFound) {
        // User doesn't exist, suggest creating an account
        navigate('/register', { state: { email: email.trim(), from } })
      } else {
        // Wrong password or other logical error
        setError(result.message)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1565c0 0%, #0d1b4b 100%)',
      padding: 20,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '50%', height: '50%', background: 'rgba(255,255,255,0.04)', borderRadius: '50%', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '40%', height: '40%', background: 'rgba(255,255,255,0.04)', borderRadius: '50%', zIndex: 0 }} />

      <div className="scale-in" style={{
        width: '100%',
        maxWidth: 440,
        padding: '48px 44px',
        borderRadius: 28,
        zIndex: 1,
        background: 'rgba(10, 20, 60, 0.75)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <svg style={{ width: 28, height: 28, fill: '#fff' }} viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#fff', marginBottom: 8, letterSpacing: -0.5 }}>
            Welcome Back
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15 }}>
            Sign in to your FlipShop account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(255, 82, 82, 0.15)',
            border: '1px solid rgba(255, 82, 82, 0.35)',
            color: '#ffaaaa',
            padding: '12px 16px',
            borderRadius: 12,
            marginBottom: 24,
            fontSize: 14,
            textAlign: 'center',
            fontWeight: 600,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? 'rgba(255,255,255,0.15)' : 'linear-gradient(135deg, #2979ff 0%, #1565c0 100%)',
              color: '#fff',
              padding: '17px',
              borderRadius: 14,
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: 1,
              boxShadow: '0 8px 24px rgba(21,101,192,0.5)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.75 : 1,
              transition: 'all 0.3s',
              border: 'none',
            }}
            onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              state={{ from }}
              style={{ color: '#90caf9', fontWeight: 800, textDecoration: 'none' }}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
