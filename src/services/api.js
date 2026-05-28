const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const API_SECRET_KEY = import.meta.env.VITE_API_SECRET_KEY || ''

async function request(endpoint, options = {}) {
  const baseUrl = API_URL.replace(/\/+$/, '')
  const url = `${baseUrl}${endpoint}`
  const token = localStorage.getItem('token')

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_SECRET_KEY,
      Authorization: `Bearer ${token || API_SECRET_KEY}`,
      ...options.headers,
    },
    ...options,
  }

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body)
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en la peticion' }))
    throw new Error(error.message || `Error ${response.status}`)
  }

  return response.json()
}

export const api = {
  auth: {
    login: (credentials) => request('/login', { method: 'POST', body: credentials }),
  },
  vehicles: {
    getAll: () => request('/vehicles'),
    getByPlate: (plate) => request(`/vehicles/${plate}`),
    create: (data) => request('/vehicles', { method: 'POST', body: data }),
    update: (plate, data) => request(`/vehicles/${plate}`, { method: 'PUT', body: data }),
    delete: (plate) => request(`/vehicles/${plate}`, { method: 'DELETE' }),
  },
  revisiones: {
    getAll: () => request('/revisiones'),
    getByVehiculo: (matricula) => request(`/revisiones/vehiculo/${matricula}`),
    getById: (id) => request(`/revisiones/${id}`),
    create: (data) => request('/revisiones', { method: 'POST', body: data }),
    update: (id, data) => request(`/revisiones/${id}`, { method: 'PUT', body: data }),
    delete: (id) => request(`/revisiones/${id}`, { method: 'DELETE' }),
  },
  users: {
    getAll: () => request('/usuarios'),
    getById: (id) => request(`/usuarios/${id}`),
    create: (data) => request('/usuarios', { method: 'POST', body: data }),
    update: (id, data) => request(`/usuarios/${id}`, { method: 'PUT', body: data }),
    delete: (id) => request(`/usuarios/${id}`, { method: 'DELETE' }),
    getVehicles: (usuarioId) => request(`/usuarios/${usuarioId}/vehiculos`),
    addVehicle: (usuarioId, plate) => request(`/usuarios/${usuarioId}/vehicles/${plate}`, { method: 'POST' }),
    getUsersByVehicle: (matricula) => request(`/vehiculos/${matricula}/usuarios`),
  },
}
