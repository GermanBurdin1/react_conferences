import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function Login() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const loc = useLocation()
  const { login: doLogin } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    
    try {
      await doLogin(login, password)
      const to = loc.state?.from?.pathname || '/'
      nav(to, { replace: true })
    } catch (e) {
      setErr(e.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🔐</div>
          <h1>Welcome Back</h1>
          <p>Sign in to access CyberConf</p>
        </div>

        <form onSubmit={submit} className="login-form">
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
              value={login} 
              onChange={e => setLogin(e.target.value)} 
              placeholder="Enter your username"
              required 
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Enter your password"
              required 
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className={`login-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="btn-spinner"></div>
                Signing in...
              </>
            ) : (
              <>
                <span>🚀</span>
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>🔒 Your data is secure and encrypted</p>
        </div>
      </div>
    </div>
  )
}
