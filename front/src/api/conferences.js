import { api } from './client.js'

// Get all: GET /conferences
export const listConfs = () => api('/conferences')

// Get one: GET /conference/:id
export const getConf = (id) => api(`/conference/${encodeURIComponent(id)}`)

// Create: POST /conference   body: { conference: {...} }
export const createConf = (payload) =>
  api('/conference', { method: 'POST', body: { conference: payload } })

// Update: PATCH /conference?id=...   body: { conference: {...} }
export const updateConf = (id, payload) =>
  api(`/conference?id=${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: { conference: payload },
  })

// Delete: DELETE /conference?id=...
export const removeConf = (id) =>
  api(`/conference?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
