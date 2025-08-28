import { useEffect, useState } from 'react'
import { listUsers, promoteAdmin } from '../api/users.js'

export default function UsersAdmin() {
  const [items, setItems] = useState([])
  const [err, setErr] = useState('')
  const load = ()=> listUsers().then(setItems).catch(e=>setErr(e.message))
  useEffect(()=>{ load() },[])
  const promote = async (id)=>{ await promoteAdmin(id); load() }
  return (
    <>
      <h1>Admin: Users</h1>
      {err && <p style={{color:'crimson'}}>{err}</p>}
      <div className="grid">
        {items.map(u=>(
          <div key={u.id} className="card">
            <div className="row" style={{justifyContent:'space-between'}}>
              <div>
                <strong>{u.id}</strong><br/>
                <span className="tag">{u.type}</span>
              </div>
              {u.type !== 'admin' && <button className="btn" onClick={()=>promote(u.id)}>Promote to admin</button>}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
