import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function Login() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()
  const loc = useLocation()
  const { login: doLogin } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      await doLogin(login, password)
      const to = loc.state?.from?.pathname || '/'
      nav(to, { replace: true })
    } catch (e) {
      setErr(e.message)
    }
  }
  return (
    <div className="card" style={{maxWidth:420, margin:'40px auto'}}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div className="field">
          <label>Login</label>
          <input value={login} onChange={e=>setLogin(e.target.value)} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        {err && <p style={{color:'crimson'}}>{err}</p>}
        <button className="btn primary">S'authentifier</button>
      </form>
    </div>
  )
}
