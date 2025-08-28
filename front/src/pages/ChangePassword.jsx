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
    setOk('')
    
    if (!oldPassword || !password) {
      return setErr('Please enter both old and new passwords.')
    }
    if (password !== confirm) {
      return setErr('New password and confirmation do not match.')
    }
    if (password.length < 6) {
      return setErr('New password must be at least 6 characters long.')
    }
    
    try {
      setLoading(true)
      await changePassword(oldPassword, password) 
      setOk('Password changed successfully!')
      setOld('')
      setNew('')
      setConfirm('')
    } catch (e) {
      setErr(String(e.message || 'Failed to change password'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="settings-card">
        <div className="settings-header">
          <div className="settings-icon">🔑</div>
          <h1>Change Password</h1>
          <p>Update your account security</p>
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
            <label className="form-label">Current Password</label>
            <input 
              type="password" 
              className="form-input"
              value={oldPassword} 
              onChange={e => setOld(e.target.value)} 
              placeholder="Enter your current password"
              required 
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <input 
              type="password" 
              className="form-input"
              value={password} 
              onChange={e => setNew(e.target.value)} 
              placeholder="Enter your new password"
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
            <label className="form-label">Confirm New Password</label>
            <input 
              type="password" 
              className="form-input"
              value={confirm} 
              onChange={e => setConfirm(e.target.value)} 
              placeholder="Confirm your new password"
              required 
              disabled={loading}
            />
            {confirm && password !== confirm && (
              <div className="password-mismatch">
                ❌ Passwords do not match
              </div>
            )}
            {confirm && password === confirm && confirm.length > 0 && (
              <div className="password-match">
                ✅ Passwords match
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
                Updating Password...
              </>
            ) : (
              <>
                <span>🔒</span>
                Update Password
              </>
            )}
          </button>
        </form>

        <div className="settings-footer">
          <div className="security-tip">
            <span className="tip-icon">💡</span>
            <div>
              <strong>Security Tip:</strong>
              <p>After changing your password, you'll need to sign in again for security reasons.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
