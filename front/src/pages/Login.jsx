import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function Login() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const loc = useLocation()
  const { login: doLogin } = useAuth()

  useEffect(() => {
    if (loc.state?.message) {
      setSuccessMessage(loc.state.message)
    }
  }, [loc.state])

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    
    try {
      await doLogin(login, password)
      const to = loc.state?.from?.pathname || '/'
      nav(to, { replace: true })
    } catch (e) {
      setErr(e.message || 'Échec de la connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🔐</div>
          <h1>Bon Retour</h1>
          <p>Connectez-vous pour accéder aux conférences CyberConf</p>
        </div>

        <form onSubmit={submit} className="login-form">
          {err && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              <span>{err}</span>
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success">
              <span className="alert-icon">✅</span>
              <span>{successMessage}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Nom d'utilisateur</label>
            <input 
              type="text"
              className="form-input"
              value={login} 
              onChange={e => setLogin(e.target.value)} 
              placeholder="Entrez votre nom d'utilisateur"
              required 
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input 
              type="password" 
              className="form-input"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Entrez votre mot de passe"
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
                Connexion...
              </>
            ) : (
              <>
                <span>🚀</span>
                Se Connecter
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Vous n'avez pas de compte?{' '}
            <Link to="/signup" className="auth-link">
              Créez-en un ici
            </Link>
          </p>
          <div className="security-notice">
            <span>🛡️</span>
            Vos données sont protégées par nos experts en sécurité
          </div>
        </div>
      </div>
    </div>
  )
}
