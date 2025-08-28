import { useState } from 'react'
import { changePassword } from '../api/auth.js'

export default function ChangePassword() {
  const [oldPassword, setOld] = useState('')
  const [password, setNew] = useState('')
  const [confirm, setConfirm] = useState('')
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const [loading, setLoading] = useState(false)

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
    setOk('')
    
    if (!oldPassword || !password) {
      return setErr('Veuillez entrer à la fois l\'ancien et le nouveau mot de passe.')
    }
    if (password !== confirm) {
      return setErr('Le nouveau mot de passe et la confirmation ne correspondent pas.')
    }
    if (password.length < 6) {
      return setErr('Le nouveau mot de passe doit comporter au moins 6 caractères.')
    }
    
    try {
      setLoading(true)
      await changePassword(oldPassword, password) 
      setOk('Mot de passe changé avec succès!')
      setOld('')
      setNew('')
      setConfirm('')
    } catch (e) {
      setErr(String(e.message || 'Échec du changement de mot de passe'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="settings-card">
        <div className="settings-header">
          <div className="settings-icon">🛡️</div>
          <h1>Changer le Mot de Passe</h1>
          <p>Mettez à jour la sécurité de votre compte</p>
        </div>

        <form onSubmit={submit} className="settings-form">
          {err && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              <span>{err}</span>
            </div>
          )}

          {ok && (
            <div className="alert alert-success">
              <span className="alert-icon">✅</span>
              <span>{ok}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Mot de Passe Actuel</label>
            <input 
              type="password" 
              className="form-input"
              value={oldPassword} 
              onChange={e => setOld(e.target.value)} 
              placeholder="Entrez votre mot de passe actuel"
              required 
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nouveau Mot de Passe</label>
            <input 
              type="password" 
              className="form-input"
              value={password} 
              onChange={e => setNew(e.target.value)} 
              placeholder="Entrez votre nouveau mot de passe"
              required 
              disabled={loading}
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
            <label className="form-label">Confirmez le Nouveau Mot de Passe</label>
            <input 
              type="password" 
              className="form-input"
              value={confirm} 
              onChange={e => setConfirm(e.target.value)} 
              placeholder="Confirmez votre nouveau mot de passe"
              required 
              disabled={loading}
            />
            {confirm && password !== confirm && (
              <div className="password-mismatch">
                ❌ Les mots de passe ne correspondent pas
              </div>
            )}
            {confirm && password === confirm && confirm.length > 0 && (
              <div className="password-match">
                ✅ Les mots de passe correspondent
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className={`settings-btn ${loading ? 'loading' : ''}`}
            disabled={loading || !oldPassword || !password || password !== confirm}
          >
            {loading ? (
              <>
                <div className="btn-spinner"></div>
                Mise à jour du mot de passe...
              </>
            ) : (
              <>
                <span>🔒</span>
                Mettre à Jour le Mot de Passe
              </>
            )}
          </button>
        </form>

        <div className="settings-footer">
          <div className="security-tip">
            <span className="tip-icon">💡</span>
            <div>
              <strong>Conseil de Sécurité:</strong>
              <p>Après avoir changé votre mot de passe, vous devrez vous reconnecter pour des raisons de sécurité.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
