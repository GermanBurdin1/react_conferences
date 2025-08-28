import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listConfs } from '../api/conferences.js'

export default function Home() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  useEffect(() => {
    listConfs().then(setItems).catch(e=>setErr(e.message)).finally(()=>setLoading(false))
  }, [])
  if (loading) return <p>Loading…</p>
  if (err) return <p style={{color:'crimson'}}>Error: {err}</p>
  return (
    <>
      <h1>Conferences</h1>
      <div className="grid">
        {items.map(c => (
          <Link key={c.id} to={`/conf/${c.id}`} className="card">
            <div style={{height:6, borderRadius:4, background:c?.design?.mainColor || '#ddd', marginBottom:8}} />
            <h3>{c.title}</h3>
            <p>{c.date}</p>
            <p style={{opacity:.7}}>{c.description?.slice(0,120)}{c.description?.length>120?'…':''}</p>
          </Link>
        ))}
      </div>
    </>
  )
}
