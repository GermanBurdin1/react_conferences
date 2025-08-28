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
    if (pwd.length < 6) return { level: 1, text: 'Faible', color: '#ff4757' }
    if (pwd.length < 8) return { level: 2, text: 'Correct', color: '#ffa502' }
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) {
      return { level: 4, text: 'Fort', color: '#2ed573' }
    }
    return { level: 3, text: 'Bon', color: '#70a1ff' }
  }

  const strength = getPasswordStrength(password)

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    
    // Validation
    if (!username || !password || !confirmPassword) {
      setErr('Veuillez remplir tous les champs.')
      setLoading(false)
      return
    }
    
    if (username.length < 3) {
      setErr('Le nom d\'utilisateur doit comporter au moins 3 caractères.')
      setLoading(false)
      return
    }
    
    if (password.length < 6) {
      setErr('Le mot de passe doit comporter au moins 6 caractères.')
      setLoading(false)
      return
    }
    
    if (password !== confirmPassword) {
      setErr('Les mots de passe ne correspondent pas.')
      setLoading(false)
      return
    }
    
    try {
      await signup(username, password)
      setSuccess(true)
      setTimeout(() => {
        nav('/login', { 
          state: { 
            message: 'Inscription réussie! Veuillez vous connecter avec vos identifiants.' 
          }
        })
      }, 2000)
    } catch (e) {
      setErr(e.message || 'Échec de l\'inscription')
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
            <h1>Inscription Réussie!</h1>
            <p>Votre compte a été créé avec succès.</p>
            <p>Redirection vers la page de connexion...</p>
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
          <h1>Rejoignez CyberConf</h1>
          <p>Créez votre compte pour accéder aux conférences de cybersécurité</p>
        </div>

        <form onSubmit={submit} className="signup-form">
          {err && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              <span>{err}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Nom d'utilisateur</label>
            <input 
              type="text"
              className="form-input"
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              placeholder="Choisissez un nom d'utilisateur unique"
              required 
              disabled={loading}
              minLength={3}
            />
            {username && username.length < 3 && (
              <div className="validation-hint error">
                Le nom d'utilisateur doit comporter au moins 3 caractères
              </div>
            )}
            {username && username.length >= 3 && (
              <div className="validation-hint success">
                ✓ Le nom d'utilisateur semble bon
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input 
              type="password" 
              className="form-input"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Créez un mot de passe fort"
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
            <label className="form-label">Confirmez le mot de passe</label>
            <input 
              type="password" 
              className="form-input"
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              placeholder="Confirmez votre mot de passe"
              required 
              disabled={loading}
            />
            {confirmPassword && password !== confirmPassword && (
              <div className="validation-hint error">
                ❌ Les mots de passe ne correspondent pas
              </div>
            )}
            {confirmPassword && password === confirmPassword && confirmPassword.length > 0 && (
              <div className="validation-hint success">
                ✅ Les mots de passe correspondent
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
                Création du compte...
              </>
            ) : (
              <>
                <span>🚀</span>
                Créer un compte
              </>
            )}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Vous avez déjà un compte?{' '}
            <Link to="/login" className="auth-link">
              Connectez-vous ici
            </Link>
          </p>
          <div className="security-notice">
            <span>🔒</span>
            Vos informations sont sécurisées et chiffrées
          </div>
        </div>
      </div>
    </div>
  )
}
