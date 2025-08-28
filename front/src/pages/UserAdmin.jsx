import { useEffect, useState } from 'react'
import { listUsers, promoteAdmin, deleteUser } from '../api/users.js'

export default function UsersAdmin() {
  const [items, setItems] = useState([])
  const [err, setErr] = useState('')
  const [promoting, setPromoting] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState('')

  const load = async () => {
    try {
      setLoading(true)
      const res = await listUsers()
      const arr = Array.isArray(res?.User) ? res.User : (Array.isArray(res) ? res : [])
      setItems(arr.filter(Boolean))
      setErr('')
    } catch (e) {
      setErr(String(e.message || 'Échec du chargement des utilisateurs'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const promote = async (uid) => {
    try {
      setPromoting(uid)
      setErr('')
      setSuccessMessage('')
      await promoteAdmin(uid)
      setSuccessMessage(`L'utilisateur ${uid} a été promu administrateur avec succès!`)
      load()
    } catch (e) {
      console.error('Promote admin error:', e)
      setErr(`Échec de la promotion de l'utilisateur ${uid}: ${e.message || 'Erreur inconnue'}`)
    } finally {
      setPromoting(null)
    }
  }

  const handleDeleteUser = async (uid) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${uid}"? Cette action ne peut pas être annulée.`)) {
      return
    }

    try {
      setDeleting(uid)
      setErr('')
      setSuccessMessage('')
      await deleteUser(uid)
      setSuccessMessage(`L'utilisateur ${uid} a été supprimé avec succès!`)
      load()
    } catch (e) {
      console.error('Delete user error:', e)
      setErr(`Échec de la suppression de l'utilisateur ${uid}: ${e.message || 'Erreur inconnue'}`)
    } finally {
      setDeleting(null)
    }
  }

  const getUserIcon = (type) => {
    return type === 'admin' ? '👑' : '👤'
  }

  const getStatusColor = (type) => {
    return type === 'admin' ? '#4CAF50' : '#2196F3'
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-header">
          <h1>👥 Gestion des Utilisateurs</h1>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement des utilisateurs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>👥 Gestion des Utilisateurs</h1>
        <p className="admin-subtitle">Gérer les rôles et permissions des utilisateurs</p>
      </div>

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

      <div className="users-stats">
        <div className="stat-card">
          <div className="stat-value">{items.length}</div>
          <div className="stat-label">Utilisateurs Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{items.filter(u => u.type === 'admin').length}</div>
          <div className="stat-label">Administrateurs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{items.filter(u => u.type === 'user').length}</div>
          <div className="stat-label">Utilisateurs Réguliers</div>
        </div>
      </div>

      <div className="users-grid">
        {items.map(u => {
          const uid = u?.id || u?._id
          const typ = u?.type || 'user'
          if (!uid) return null

          return (
            <div key={uid} className="user-card">
              <div className="user-info">
                <div className="user-avatar">
                  {getUserIcon(typ)}
                </div>
                <div className="user-details">
                  <div className="user-name">{uid}</div>
                  <div 
                    className="user-role" 
                    style={{ color: getStatusColor(typ) }}
                  >
                    {typ === 'admin' ? 'Administrateur' : 'Utilisateur'}
                  </div>
                </div>
              </div>
              
              <div className="user-actions">
                <div className="action-buttons">
                  {typ !== 'admin' && (
                    <button 
                      className={`btn btn-promote ${promoting === uid ? 'loading' : ''}`}
                      onClick={() => promote(uid)}
                      disabled={promoting === uid || deleting === uid}
                    >
                      {promoting === uid ? (
                        <>
                          <div className="btn-spinner"></div>
                          Promotion...
                        </>
                      ) : (
                        <>
                          <span>👑</span>
                          Promouvoir
                        </>
                      )}
                    </button>
                  )}
                  
                  {typ === 'admin' && (
                    <div className="admin-badge">
                      <span>👑</span>
                      Administrateur
                    </div>
                  )}
                  
                  <button 
                    className={`btn btn-delete ${deleting === uid ? 'loading' : ''}`}
                    onClick={() => handleDeleteUser(uid)}
                    disabled={deleting === uid || promoting === uid}
                  >
                    {deleting === uid ? (
                      <>
                        <div className="btn-spinner"></div>
                        Suppression...
                      </>
                    ) : (
                      <>
                        <span>🗑️</span>
                        Supprimer
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {items.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>Aucun utilisateur trouvé</h3>
          <p>Il n'y a actuellement aucun utilisateur dans le système.</p>
        </div>
      )}
    </div>
  )
}
