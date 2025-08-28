import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getConf } from '../api/conferences.js'

export default function ConferenceDetail() {
  const { id } = useParams()
  const [c, setC] = useState(null)
  const [err, setErr] = useState('')
  useEffect(() => { getConf(id).then(setC).catch(e=>setErr(e.message)) }, [id])
  if (err) return <p style={{color:'crimson'}}>Erreur: {err}</p>
  if (!c) return <p>Chargement…</p>
  const main = c?.design?.mainColor || '#222', second = c?.design?.secondColor || '#666'
  return (
    <div className="card" style={{ borderColor: main }}>
      <div style={{height:8, background: main, borderRadius:6, marginBottom:10}} />
      <h1 style={{color: main}}>{c.title}</h1>
      <p><strong>Date:</strong> {c.date}</p>
      <p>{c.description}</p>
      {c.img && <img src={c.img} alt="" style={{maxWidth:'100%', borderRadius:8, border:`1px solid ${second}`}} />}
      <h3 style={{color: second}}>Intervenants</h3>
      <ul>{(c.speakers||[]).map((s,i)=><li key={i}>{s.firstname} {s.lastname}</li>)}</ul>
      <h3 style={{color: second}}>Parties Prenantes</h3>
      <ul>{(c.stakeholders||[]).map((s,i)=><li key={i}>{s.firstname} {s.lastname} {s.job?`— ${s.job}`:''}</li>)}</ul>
      {c.osMap?.city && <p><strong>Ville:</strong> {c.osMap.city}</p>}
    </div>
  )
}
