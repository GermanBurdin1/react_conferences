import { useState } from 'react'
import { changePassword } from '../api/auth.js'

export default function ChangePassword() {
  const [oldPassword, setOld] = useState('')
  const [password, setNew] = useState('')
  const [confirm, setConfirm] = useState('')
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setErr(''); setOk('')
    if (!oldPassword || !password) return setErr('Mettez l\'ancien et le nouveau mot de passe.')
    if (password !== confirm) return setErr('Le nouveau mot de passe et la confirmation ne correspondent pas.')
    try {
      setLoading(true)
      await changePassword(oldPassword, password) 
      setOk('Mot de passe changé.')
      setOld(''); setNew(''); setConfirm('')
    } catch (e) {
      setErr(String(e.message || 'Erreur'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card" style={{maxWidth:480, margin:'32px auto'}}>
      <h2>Change password</h2>
      <form onSubmit={submit}>
        <div className="field">
          <label>Old password</label>
          <input type="password" value={oldPassword} onChange={e=>setOld(e.target.value)} required />
        </div>
        <div className="field">
          <label>New password</label>
          <input type="password" value={password} onChange={e=>setNew(e.target.value)} required />
        </div>
        <div className="field">
          <label>Confirm new password</label>
          <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required />
        </div>
        {err && <p style={{color:'crimson'}}>{err}</p>}
        {ok && <p style={{color:'seagreen'}}>{ok}</p>}
        <button className="btn primary" disabled={loading}>{loading?'Saving…':'Save'}</button>
      </form>
      <p style={{opacity:.7, marginTop:8}}>Après le changement du mdp authentifiez-vous à nouveau.</p>
    </div>
  )
}
