import { useEffect, useState } from 'react'
import { createConf, listConfs, removeConf, updateConf } from '../api/conferences.js'

const empty = { title:'', date:'', description:'', img:'', content:'', duration:'', design:{ mainColor:'#222222', secondColor:'#666666' } }

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
      if (editingId) await updateConf(editingId, form); else await createConf(form)
      setForm(empty); setEditingId(null); load()
    } catch(e){ setErr(e.message) }
  }
  const edit = (c)=>{ setEditingId(c.id); setForm({ ...c }); }
  const del = async (id)=>{ if (!confirm('Delete?')) return; await removeConf(id); load() }

  return (
    <>
      <h1>Admin: Conferences</h1>
      {err && <p style={{color:'crimson'}}>{err}</p>}
      <div className="row">
        <form onSubmit={onSubmit} className="card" style={{flex:'1 1 360px', minWidth:320}}>
          <h3>{editingId ? 'Edit' : 'Create'} conference</h3>
          <div className="field"><label>Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/></div>
          <div className="field"><label>Date</label><input value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required/></div>
          <div className="field"><label>Description</label><textarea rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
          <div className="field"><label>Image URL</label><input value={form.img} onChange={e=>setForm({...form,img:e.target.value})}/></div>
          <div className="row">
            <div className="field" style={{flex:1}}><label>Main color</label><input type="color" value={form.design.mainColor} onChange={e=>setForm({...form,design:{...form.design,mainColor:e.target.value}})} /></div>
            <div className="field" style={{flex:1}}><label>Second color</label><input type="color" value={form.design.secondColor} onChange={e=>setForm({...form,design:{...form.design,secondColor:e.target.value}})} /></div>
          </div>
          <button className="btn primary">{editingId ? 'Save' : 'Create'}</button>
        </form>
        <div style={{flex:1}}>
          <h3>List</h3>
          <div className="grid">
            {items.map(c=>(
              <div key={c.id} className="card">
                <div style={{height:6, background:c?.design?.mainColor||'#ddd', borderRadius:4, marginBottom:8}}/>
                <strong>{c.title}</strong>
                <div className="row" style={{marginTop:8}}>
                  <button className="btn" onClick={()=>edit(c)}>Edit</button>
                  <button className="btn danger" onClick={()=>del(c.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
