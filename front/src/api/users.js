import { api } from './client.js'

// Get all: GET /users
export const listUsers = () => api('/users')

export const promoteAdmin = async (id) => {
  console.log('promoteAdmin', id)
  return api(`/usertype/${encodeURIComponent(id)}`, { method: "PATCH", body: { newType: 'admin' } })
}

export const deleteUser = async (id) => {
  return api(`/user/${encodeURIComponent(id)}`, { method: "DELETE" })
}
