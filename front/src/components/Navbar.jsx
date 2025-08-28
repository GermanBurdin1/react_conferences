import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const onLogout = () => { logout(); nav('/login', { replace: true }); }

  return (
    <nav>
      <div className="navwrap">
        <div className="row">
          <Link to={user ? '/' : '/login'}><strong>CyberConf</strong></Link>
          {user && <Link to="/">Conferences</Link>}
        </div>
        <div className="row">
          {user?.type === 'admin' && (
            <>
              <Link to="/admin/conferences">Admin Conferences</Link>
              <Link to="/admin/users">Admin Users</Link>
            </>
          )}
          {user ? (
            <>
              <Link to="/password">Change password</Link>
              <span className="tag">{user.type}</span>
              <button className="btn" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn">Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
