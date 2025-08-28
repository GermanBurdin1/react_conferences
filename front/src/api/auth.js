import { api } from './client.js'

// login
export async function login(id, password) {
  const res = await api('/login', { method: 'POST', body: { id, password } })
  const token = res?.Token || res?.token
  if (!token) throw new Error('No token in /login response')
  return { token, id }
}

// vérifier le rôle
export async function isAdmin() {
  const res = await api('/isadmin')
  return !!(res?.isAdmin ?? res?.isadmin)
}

// s'authentifier
export const signup = (id, password) =>
  api('/signup', { method: 'POST', body: { id, password } })

// changer le mdp
export const changePassword = (oldPassword, password) =>
  api('/userpassword', { method: 'PATCH', body: { oldPassword, password } })
