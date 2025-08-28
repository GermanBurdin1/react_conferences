import { useEffect, useState } from 'react'
import { listUsers, promoteAdmin } from '../api/users.js'

export default function UsersAdmin() {
  const [items, setItems] = useState([])
  const [err, setErr] = useState('')
  const [promoting, setPromoting] = useState(null)
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
      setErr(String(e.message || 'Failed to load users'))
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
      setSuccessMessage(`User ${uid} has been promoted to admin successfully!`)
      load()
    } catch (e) {
      console.error('Promote admin error:', e)
      setErr(`Failed to promote user ${uid}: ${e.message || 'Unknown error'}`)
    } finally {
      setPromoting(null)
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
          <h1>👥 User Management</h1>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>👥 User Management</h1>
        <p className="admin-subtitle">Manage user roles and permissions</p>
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
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{items.filter(u => u.type === 'admin').length}</div>
          <div className="stat-label">Administrators</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{items.filter(u => u.type === 'user').length}</div>
          <div className="stat-label">Regular Users</div>
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
                    {typ === 'admin' ? 'Administrator' : 'User'}
                  </div>
                </div>
              </div>
              
              <div className="user-actions">
                {typ !== 'admin' ? (
                  <button 
                    className={`btn btn-promote ${promoting === uid ? 'loading' : ''}`}
                    onClick={() => promote(uid)}
                    disabled={promoting === uid}
                  >
                    {promoting === uid ? (
                      <>
                        <div className="btn-spinner"></div>
                        Promoting...
                      </>
                    ) : (
                      <>
                        <span>👑</span>
                        Promote to Admin
                      </>
                    )}
                  </button>
                ) : (
                  <div className="admin-badge">
                    <span>👑</span>
                    Administrator
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {items.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No users found</h3>
          <p>There are currently no users in the system.</p>
        </div>
      )}
    </div>
  )
}
