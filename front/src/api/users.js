import { api } from './client.js'

// Get all: GET /users
export const listUsers = () => api('/users')

// Promote: PATCH /usertype?id=...   body: { newType: 'admin' }
export const promoteAdmin = (id) =>
  api(`/usertype?id=${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: { newType: 'admin' },
  })

// supprimer le user: DELETE /user?id=...
export const deleteUser = (id) =>
  api(`/user?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
