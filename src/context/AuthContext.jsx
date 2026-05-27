/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react'
import { api } from '../services/api'

const AuthContext = createContext()

function getInitialUserId() {
  return localStorage.getItem('userId')
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const userId = getInitialUserId()

  const fetchUser = useCallback(async (id) => {
    try {
      const data = await api.users.getById(id)
      setUser({
        id: data.idUsuario,
        username: data.username,
        name: `${data.nombre} ${data.apellido}${data.segundoApellido ? ' ' + data.segundoApellido : ''}`.trim(),
        email: data.email,
        role: data.rol,
        telefono: data.telefono,
        fechaCreacion: data.fechaCreacion,
      })
    } catch (error) {
      setUser(null)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUserId = localStorage.getItem('userId')
    if (token && storedUserId) {
      fetchUser(storedUserId)
    } else {
      setLoading(false)
    }
  }, [fetchUser])

  const login = async (username, password) => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    const data = await api.auth.login({ username, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', data.userId)
    await fetchUser(data.userId)
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    setUser(null)
  }

  const value = useMemo(() => ({
    user,
    login,
    logout,
    isClient: user?.role === 0,
    isMechanic: user?.role === 1,
    loading,
  }), [user, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
