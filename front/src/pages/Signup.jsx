import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../api/auth.js'

export default function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const nav = useNavigate()

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, text: '', color: '#ddd' }
    if (pwd.length < 6) return { level: 1, text: 'Weak', color: '#ff4757' }
    if (pwd.length < 8) return { level: 2, text: 'Fair', color: '#ffa502' }
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) {
      return { level: 4, text: 'Strong', color: '#2ed573' }
    }
    return { level: 3, text: 'Good', color: '#70a1ff' }
  }

  const strength = getPasswordStrength(password)

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    
    // Validation
    if (!username || !password || !confirmPassword) {
      setErr('Please fill in all fields.')
      setLoading(false)
      return
    }
    
    if (username.length < 3) {
      setErr('Username must be at least 3 characters long.')
      setLoading(false)
      return
    }
    
    if (password.length < 6) {
      setErr('Password must be at least 6 characters long.')
      setLoading(false)
      return
    }
    
    if (password !== confirmPassword) {
      setErr('Passwords do not match.')
      setLoading(false)
      return
    }
    
    try {
      await signup(username, password)
      setSuccess(true)
      setTimeout(() => {
        nav('/login', { 
          state: { 
            message: 'Registration successful! Please login with your credentials.' 
          }
        })
      }, 2000)
    } catch (e) {
      setErr(e.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="signup-container">
        <div className="signup-card">
          <div className="success-animation">
            <div className="success-icon">✅</div>
            <h1>Registration Successful!</h1>
            <p>Your account has been created successfully.</p>
            <p>Redirecting to login page...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <div className="signup-icon">🎯</div>
          <h1>Join CyberConf</h1>
          <p>Create your account to access cybersecurity conferences</p>
        </div>

        <form onSubmit={submit} className="signup-form">
          {err && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              <span>{err}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text"
              className="form-input"
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              placeholder="Choose a unique username"
              required 
              disabled={loading}
              minLength={3}
            />
            {username && username.length < 3 && (
              <div className="validation-hint error">
                Username must be at least 3 characters
              </div>
            )}
            {username && username.length >= 3 && (
              <div className="validation-hint success">
                ✓ Username looks good
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Create a strong password"
              required 
              disabled={loading}
              minLength={6}
            />
            {password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className="strength-fill" 
                    style={{ 
                      width: `${(strength.level / 4) * 100}%`,
                      backgroundColor: strength.color 
                    }}
                  ></div>
                </div>
                <span className="strength-text" style={{ color: strength.color }}>
                  {strength.text}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input 
              type="password" 
              className="form-input"
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              placeholder="Confirm your password"
              required 
              disabled={loading}
            />
            {confirmPassword && password !== confirmPassword && (
              <div className="validation-hint error">
                ❌ Passwords do not match
              </div>
            )}
            {confirmPassword && password === confirmPassword && confirmPassword.length > 0 && (
              <div className="validation-hint success">
                ✅ Passwords match
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className={`signup-btn ${loading ? 'loading' : ''}`}
            disabled={loading || !username || !password || password !== confirmPassword}
          >
            {loading ? (
              <>
                <div className="btn-spinner"></div>
                Creating Account...
              </>
            ) : (
              <>
                <span>🚀</span>
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
          <div className="security-notice">
            <span>🔒</span>
            Your information is secure and encrypted
          </div>
        </div>
      </div>
    </div>
  )
}
