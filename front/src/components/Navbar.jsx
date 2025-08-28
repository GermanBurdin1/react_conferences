import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const onLogout = () => { logout(); nav('/login', { replace: true }); }

  return (
    <nav className="modern-nav">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to={user ? '/' : '/login'} className="brand-link">
            <span className="brand-icon">🔐</span>
            <span className="brand-text">CyberConf</span>
          </Link>
        </div>

        <div className="nav-links">
          {user && (
            <Link to="/" className="nav-link">
              <span className="nav-icon">🎯</span>
              Conferences
            </Link>
          )}
          
          {user?.type === 'admin' && (
            <div className="admin-dropdown">
              <span className="admin-badge">
                <span className="admin-icon">👑</span>
                Admin
              </span>
              <div className="dropdown-content">
                <Link to="/admin/conferences" className="dropdown-link">
                  <span>📋</span>
                  Manage Conferences
                </Link>
                <Link to="/admin/users" className="dropdown-link">
                  <span>👥</span>
                  Manage Users
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/password" className="nav-action-link">
                <span>🔑</span>
                Change Password
              </Link>
              
              <div className="user-info">
                <span className={`user-badge ${user.type}`}>
                  {user.type === 'admin' ? '👑' : '👤'} {user.type}
                </span>
              </div>
              
              <button className="logout-btn" onClick={onLogout}>
                <span>🚪</span>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="login-nav-btn">
              <span>🔓</span>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
