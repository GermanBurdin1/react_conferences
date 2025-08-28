import { useEffect, useState } from 'react'
import { createConf, listConfs, removeConf, updateConf } from '../api/conferences.js'

const empty = {
  title:'', date:'', description:'', img:'', content:'', duration:'',
  design:{ mainColor:'#222222', secondColor:'#666666' }
}

export default function ConferencesAdmin() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [err, setErr] = useState('')

  const load = ()=> listConfs().then(setItems).catch(e=>setErr(e.message))
  useEffect(()=>{ load() },[])

  const onSubmit = async (e) => {
    e.preventDefault(); setErr('')
    try {
      // Validation simple côté frontend
      const f = form
      if (!f.title || !f.description || !f.img || !f.content || !f.design?.mainColor || !f.design?.secondColor) {
        setErr('Remplissez tous les champs obligatoires: titre, description, image, contenu, couleurs.')
        return
      }
      if (editingId) await updateConf(editingId, f); else await createConf(f)
      setForm(empty); setEditingId(null); load()
    } catch(e){ setErr(e.message) }
  }

  const edit = (c)=>{ setEditingId(c.id); setForm({ ...c }) }
  const del = async (id)=>{ if (!confirm('Supprimer cette conférence?')) return; await removeConf(id); load() }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>📅 Admin: Conférences</h1>
        <p className="admin-subtitle">Créez et gérez vos conférences</p>
      </div>
      
      {err && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <span>{err}</span>
        </div>
      )}

      <div className="conferences-admin-layout">
        <div className="conference-form-section">
        <form onSubmit={onSubmit} className="conference-form">
          <h3>{editingId ? 'Éditer' : 'Créer'} la conférence</h3>

          <div className="field">
            <label>Titre *</label>
            <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
          </div>

          <div className="field">
            <label>Date *</label>
            <input 
              type="date" 
              value={form.date} 
              onChange={e=>setForm({...form,date:e.target.value})} 
              required 
            />
          </div>

          <div className="field">
            <label>Description *</label>
            <textarea rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required />
          </div>

          <div className="field">
            <label>URL de l'image *</label>
            <input value={form.img} onChange={e=>setForm({...form,img:e.target.value})} required />
          </div>

          <div className="field">
            <label>Contenu *</label>
            <textarea rows={4} value={form.content} onChange={e=>setForm({...form,content:e.target.value})} required />
          </div>

          <div className="colors-section">
            <h4>Thème visuel</h4>
            <div className="color-fields">
              <div className="color-field">
                <label>Couleur principale *</label>
                <div className="color-input-group">
                  <input type="color"
                    value={form.design.mainColor}
                    onChange={e=>setForm({...form,design:{...form.design,mainColor:e.target.value}})}
                    required 
                  />
                  <div className="color-preview" style={{backgroundColor: form.design.mainColor}}>
                    <span className="color-code">{form.design.mainColor}</span>
                  </div>
                </div>
              </div>
              <div className="color-field">
                <label>Couleur secondaire *</label>
                <div className="color-input-group">
                  <input type="color"
                    value={form.design.secondColor}
                    onChange={e=>setForm({...form,design:{...form.design,secondColor:e.target.value}})}
                    required 
                  />
                  <div className="color-preview" style={{backgroundColor: form.design.secondColor}}>
                    <span className="color-code">{form.design.secondColor}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="theme-preview">
              <div className="preview-card" style={{borderLeft: `4px solid ${form.design.mainColor}`}}>
                <h5 style={{color: form.design.mainColor}}>Aperçu de la conférence</h5>
                <p style={{color: form.design.secondColor}}>Voici comment apparaîtront les couleurs</p>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? '💾 Sauvegarder' : '✨ Créer la conférence'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={() => {setForm(empty); setEditingId(null)}}>
                ❌ Annuler
              </button>
            )}
          </div>
        </form>
        </div>

        <div className="conferences-list-section">
          <div className="list-header">
            <h3>📋 Conférences existantes</h3>
            <span className="conferences-count">{items.length} conférence(s)</span>
          </div>
          <div className="conferences-grid">
            {items.map(c=>(
              <div key={c.id} className="conference-admin-card">
                <div className="conference-card-header">
                  <div 
                    className="conference-accent-bar" 
                    style={{background: c?.design?.mainColor || '#ddd'}}
                  />
                  <div className="conference-date-badge">
                    📅 {c.date ? new Date(c.date).toLocaleDateString('fr-FR') : 'Pas de date'}
                  </div>
                </div>
                
                <div className="conference-card-content">
                  <h4 className="conference-title" style={{color: c?.design?.mainColor || '#374151'}}>
                    {c.title}
                  </h4>
                  
                  <p className="conference-description">
                    {c.description ? 
                      (c.description.length > 120 ? 
                        c.description.substring(0, 120) + '...' : 
                        c.description
                      ) : 
                      'Aucune description'
                    }
                  </p>
                  
                  <div className="conference-meta">
                    {c.img && (
                      <div className="meta-item">
                        <span className="meta-icon">🖼️</span>
                        <span className="meta-text">Image incluse</span>
                      </div>
                    )}
                    <div className="meta-item">
                      <span className="meta-icon">🎨</span>
                      <span className="meta-text">
                        <span 
                          className="color-dot" 
                          style={{backgroundColor: c?.design?.mainColor}}
                        ></span>
                        <span 
                          className="color-dot" 
                          style={{backgroundColor: c?.design?.secondColor}}
                        ></span>
                        Thème personnalisé
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="conference-card-actions">
                  <button 
                    className="btn btn-edit" 
                    onClick={()=>edit(c)}
                    title="Modifier cette conférence"
                  >
                    ✏️ Éditer
                  </button>
                  <button 
                    className="btn btn-delete" 
                    onClick={()=>del(c.id)}
                    title="Supprimer cette conférence"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
