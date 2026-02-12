import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

export const predictDigit = async (pixels) => {
  const response = await api.post('/predict', { pixels })
  return response.data
}

export const getDrawings = async () => {
  const response = await api.get('/drawings')
  return response.data
}

export const deleteDrawing = async (id) => {
  const response = await api.delete(`/drawings/${id}`)
  return response.data
}

export default api
