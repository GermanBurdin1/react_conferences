import { createContext, useContext, useEffect, useState } from 'react'
import * as authApi from '../api/auth.js'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null) // { id, type, token }

  useEffect(() => {
    const raw = localStorage.getItem('auth')
    if (raw) setUser(JSON.parse(raw))
  }, [])

  // login(login, password) => /login {id,password} + /isadmin
  const login = async (loginId, password) => {
    const { token, id } = await authApi.login(loginId, password)

    // Временно положим токен в localStorage, чтобы /isadmin увидел Authorization
    localStorage.setItem('auth', JSON.stringify({ token }))

    const isAdm = await authApi.isAdmin()
    const obj = { id, token, type: isAdm ? 'admin' : 'user' }

    setUser(obj)
    localStorage.setItem('auth', JSON.stringify(obj))
    return obj
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth')
  }

  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>
}
