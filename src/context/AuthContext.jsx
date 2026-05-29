/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { api } from '../services/api'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => {
    return !!(localStorage.getItem('token') && localStorage.getItem('userId'))
  })
  const initialized = useRef(false)

  const fetchUser = useCallback(async (id) => {
    try {
      const data = await api.users.getById(id)
      setUser({
        id: data.user_id,
        username: data.username,
        name: `${data.name} ${data.first_last_name}${data.second_last_name ? ' ' + data.second_last_name : ''}`.trim(),
        email: data.email,
        role: data.role,
        telefono: data.phone_number,
        fechaCreacion: data.creation_date,
      })
    } catch (error) {
      setUser(null)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const token = localStorage.getItem('token')
    const storedUserId = localStorage.getItem('userId')
    if (token && storedUserId) {
      Promise.resolve().then(() => fetchUser(storedUserId))
    }
  }, [fetchUser])

  const login = useCallback(async (username, password) => {
    const data = await api.auth.login({ username, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', data.userId)
    await fetchUser(data.userId)
    return data
  }, [fetchUser])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    setUser(null)
  }, [])

  const value = useMemo(() => ({
    user,
    login,
    logout,
    isClient: user?.role === 0,
    isMechanic: user?.role === 1,
    loading,
  }), [user, login, logout, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
