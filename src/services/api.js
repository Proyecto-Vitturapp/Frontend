const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`
  const token = localStorage.getItem('token')

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
    register: (data) => request('/auth/register', { method: 'POST', body: data }),
  },
  cars: {
    getAll: () => request('/cars'),
    getMyCars: () => request('/cars/my-cars'),
    getById: (id) => request(`/cars/${id}`),
    create: (data) => request('/cars', { method: 'POST', body: data }),
    update: (id, data) => request(`/cars/${id}`, { method: 'PUT', body: data }),
    delete: (id) => request(`/cars/${id}`, { method: 'DELETE' }),
  },
  visits: {
    getByCar: (carId) => request(`/cars/${carId}/visits`),
    create: (carId, data) => request(`/cars/${carId}/visits`, { method: 'POST', body: data }),
    update: (carId, visitId, data) => request(`/cars/${carId}/visits/${visitId}`, { method: 'PUT', body: data }),
    delete: (carId, visitId) => request(`/cars/${carId}/visits/${visitId}`, { method: 'DELETE' }),
  },
  users: {
    getProfile: () => request('/users/profile'),
    updateProfile: (data) => request('/users/profile', { method: 'PUT', body: data }),
  },
}
