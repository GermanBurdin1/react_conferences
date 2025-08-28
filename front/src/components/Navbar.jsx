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
            {user?.type === 'admin' && (
              <span className="admin-welcome">• Bienvenue, Admin</span>
            )}
          </Link>
        </div>

        <div className="nav-links">
          {user && (
            <Link to="/" className="nav-link">
              <span className="nav-icon">🎆</span>
              Conférences
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
                  <span>📅</span>
                  Gérer les Conférences
                </Link>
                <Link to="/admin/users" className="dropdown-link">
                  <span>👥</span>
                  Gérer les Utilisateurs
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <div className="user-menu-dropdown">
                <span className="user-menu-badge">
                  <span className="user-menu-icon">👤</span>
                  Mon Compte
                </span>
                <div className="dropdown-content user-menu-content">
                  <Link to="/password" className="dropdown-link">
                    <span>🔑</span>
                    Changer le Mot de Passe
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={onLogout} className="dropdown-link logout-link">
                    <span>🚪</span>
                    Déconnexion
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/signup" className="signup-nav-btn">
                <span>✨</span>
                S'inscrire
              </Link>
              <Link to="/login" className="login-nav-btn">
                <span>🔓</span>
                Connexion
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
