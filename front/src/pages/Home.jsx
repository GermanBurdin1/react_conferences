import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listConfs } from '../api/conferences.js'

export default function Home() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    const loadConferences = async () => {
      try {
        setLoading(true)
        const conferences = await listConfs()
        setItems(Array.isArray(conferences) ? conferences : [])
        setErr('')
      } catch (e) {
        setErr(e.message || 'Échec du chargement des conférences')
      } finally {
        setLoading(false)
      }
    }
    loadConferences()
  }, [])

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement des conférences...</p>
        </div>
      </div>
    )
  }

  if (err) {
    return (
      <div className="page-container">
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <span>Erreur: {err}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🎆 Conférences Cyber</h1>
        <p className="page-subtitle">Découvrez les dernières conférences et événements de cybersécurité</p>
      </div>

      <div className="conferences-stats">
        <div className="stat-card">
          <div className="stat-value">{items.length}</div>
          <div className="stat-label">Événements Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{items.filter(c => new Date(c.date) > new Date()).length}</div>
          <div className="stat-label">À Venir</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{items.filter(c => c.title?.toLowerCase().includes('security')).length}</div>
          <div className="stat-label">Événements Sécurité</div>
        </div>
      </div>

      <div className="conferences-grid">
        {items.map(c => (
          <Link key={c.id} to={`/conf/${c.id}`} className="conference-card">
            <div className="conference-header">
              <div 
                className="conference-accent" 
                style={{background: c?.design?.mainColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}
              />
              <div className="conference-date">
                📅 {new Date(c.date).toLocaleDateString()}
              </div>
            </div>
            
            <div className="conference-content">
              <h3 className="conference-title">{c.title}</h3>
              <p className="conference-description">
                {c.description?.slice(0, 150)}
                {c.description?.length > 150 ? '...' : ''}
              </p>
            </div>

            <div className="conference-footer">
              <div className="conference-status">
                {new Date(c.date) > new Date() ? (
                  <span className="status-badge upcoming">À Venir</span>
                ) : (
                  <span className="status-badge past">Événement Passé</span>
                )}
              </div>
              <div className="view-details">
                Voir les Détails →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {items.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎆</div>
          <h3>Aucune conférence trouvée</h3>
          <p>Il n'y a actuellement aucune conférence disponible.</p>
        </div>
      )}
    </div>
  )
}
