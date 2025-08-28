import { api } from './client.js'

export async function login(id, password) {
  const res = await api('/login', { method: 'POST', body: { id, password } })

  let token = typeof res === 'string' ? res : (res?.Token || res?.token || res?.jwt || res?.accessToken)

  if (typeof token === 'string') token = token.replace(/^"|"$/g, '')

  if (!token || token.length < 10) {
    throw new Error('No token in /login response')
  }
  return { token, id }
}

export async function isAdmin() {
  const res = await api('/isadmin')
  return !!(res?.isAdmin ?? res?.isadmin)
}

export const signup = (id, password) =>
  api('/signup', { method: 'POST', body: { id, password } })

export const changePassword = (oldPassword, password) =>
  api('/userpassword', { method: 'PATCH', body: { oldPassword, password } })