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

export default function RegisterPage() {
  // Authentication context and navigation utilities
  const { register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Pre-fill email if redirected from login (email not found)
  // State management for form inputs, loading status, and error messages
  const from = location.state?.from || '/'
  const [name, setName] = useState('')
  const [email, setEmail] = useState(location.state?.email || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  /**
   * Validates form inputs before submission.
   * Returns an error message if validation fails, otherwise returns null.
   */
  function validate() {
    if (!name.trim()) return 'Please enter your full name.'
    if (!email.includes('@')) return 'Please enter a valid email.'
    if (password.length < 6) return 'Password must be at least 6 characters.'
    if (password !== confirmPassword) return 'Passwords do not match.'
    return null
  }

  /**
   * Handles form submission: validates, attempts registration,
   * and redirects user upon success.
   */
  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    
    // Step 1: Run client-side validation
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    
    setLoading(true)
    try {
      // Step 2: Call the register function from AuthContext
      const result = register(name.trim(), email.trim().toLowerCase(), password)
      
      // Step 3: Handle the registration result
      if (result.success) {
        // Redirect to the intended page or home
        navigate(from, { replace: true })
      } else {
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
      background: 'linear-gradient(135deg, #4a0080 0%, #1a0d2e 100%)',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '50%', height: '50%', background: 'rgba(255,255,255,0.04)', borderRadius: '50%', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '40%', height: '40%', background: 'rgba(255,255,255,0.04)', borderRadius: '50%', zIndex: 0 }} />

      <div className="scale-in" style={{
        width: '100%',
        maxWidth: 440,
        padding: '44px 44px',
        borderRadius: 28,
        zIndex: 1,
        background: 'rgba(30, 5, 55, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 32px 64px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <svg style={{ width: 28, height: 28, fill: '#fff' }} viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 6, letterSpacing: -0.5 }}>Create Account</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>Join FlipShop and start shopping</p>
        </div>

        {/* Redirect hint when email was not found */}
        {location.state?.email && !error && (
          <div style={{
            background: 'rgba(100,180,255,0.12)',
            border: '1px solid rgba(100,180,255,0.3)',
            color: '#90caf9',
            padding: '12px 16px',
            borderRadius: 12,
            marginBottom: 20,
            fontSize: 13,
            textAlign: 'center',
            fontWeight: 600,
            lineHeight: 1.5,
          }}>
            No account found for <strong style={{ color: '#fff' }}>{location.state.email}</strong>
            <br />Create one below!
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(255, 82, 82, 0.15)',
            border: '1px solid rgba(255, 82, 82, 0.35)',
            color: '#ffaaaa',
            padding: '12px 16px',
            borderRadius: 12,
            marginBottom: 20,
            fontSize: 14,
            textAlign: 'center',
            fontWeight: 600,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Full Name</label>
            <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Email Address</label>
            <input type="email" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Password</label>
            <input type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>Confirm Password</label>
            <input type="password" placeholder="Re-enter password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={inputStyle} />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? 'rgba(255,255,255,0.15)' : 'linear-gradient(135deg, #9c27b0 0%, #6a11cb 100%)',
              color: '#fff',
              padding: '17px',
              borderRadius: 14,
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: 1,
              boxShadow: '0 8px 24px rgba(106,17,203,0.4)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.75 : 1,
              transition: 'all 0.3s',
              border: 'none',
            }}
            onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#ce93d8', fontWeight: 800, textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
