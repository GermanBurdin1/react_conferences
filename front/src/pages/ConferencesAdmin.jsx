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
      // простая фронт-валидация
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
    <>
      <h1>📅 Admin: Conférences</h1>
      {err && <p style={{color:'crimson'}}>{err}</p>}

      <div className="row">
        <form onSubmit={onSubmit} className="card" style={{flex:'1 1 360px', minWidth:320}}>
          <h3>{editingId ? 'Éditer' : 'Créer'} la conférence</h3>

          <div className="field">
            <label>Titre *</label>
            <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
          </div>

          <div className="field">
            <label>Date</label>
            <input value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
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

          <div className="row">
            <div className="field" style={{flex:1}}>
              <label>Couleur principale *</label>
              <input type="color"
                value={form.design.mainColor}
                onChange={e=>setForm({...form,design:{...form.design,mainColor:e.target.value}})}
                required />
            </div>
            <div className="field" style={{flex:1}}>
              <label>Couleur secondaire *</label>
              <input type="color"
                value={form.design.secondColor}
                onChange={e=>setForm({...form,design:{...form.design,secondColor:e.target.value}})}
                required />
            </div>
          </div>

          <button className="btn primary">{editingId ? 'Sauvegarder' : 'Créer'}</button>
        </form>

        <div style={{flex:1}}>
          <h3>Liste</h3>
          <div className="grid">
            {items.map(c=>(
              <div key={c.id} className="card">
                <div style={{height:6, background:c?.design?.mainColor||'#ddd', borderRadius:4, marginBottom:8}}/>
                <strong>{c.title}</strong>
                <div className="row" style={{marginTop:8}}>
                  <button className="btn" onClick={()=>edit(c)}>Éditer</button>
                  <button className="btn danger" onClick={()=>del(c.id)}>Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
