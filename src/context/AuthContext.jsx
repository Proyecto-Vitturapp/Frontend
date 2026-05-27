/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo } from 'react'
import { api } from '../services/api'

const AuthContext = createContext()

function getInitialUser() {
  const token = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')
  if (token && storedUser) {
    return JSON.parse(storedUser)
  }
  return null
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser)
  const [loading] = useState(false)

  const login = async (username, password) => {
    const data = await api.auth.login({ username, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({ username: data.username, role: data.role }))
    setUser({ username: data.username, role: data.role })
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
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
