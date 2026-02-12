import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const predictDigit = (pixels) =>
  api.post('/predict', { pixels }).then((res) => res.data)

export const getDrawings = (limit = 50, offset = 0) =>
  api.get('/drawings', { params: { limit, offset } }).then((res) => res.data)

export const deleteDrawing = (id) =>
  api.delete(`/drawings/${id}`).then((res) => res.data)

export default api
