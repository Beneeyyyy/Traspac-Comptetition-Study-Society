import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Create context with default value
const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  checkAuth: async () => {}
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get('/api/auth/check-auth')
      console.log('Raw auth response:', response.data)
      
      if (response.data && response.data.user) {
        const userData = response.data.user
        console.log('Setting user data:', userData)
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    console.log('AuthProvider mounted, checking auth...')
    checkAuth()
  }, [checkAuth])

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password })
      console.log('Raw login response:', response.data)
      
      if (response.data && response.data.user) {
        const userData = response.data.user
        console.log('Setting user data after login:', userData)
        setUser(userData)
      }
      return response.data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      console.log('Attempting logout...')
      await api.post('/api/auth/signout')
      setUser(null)
      console.log('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      setUser(null)
    }
  }

  console.log('Current auth state:', { user, loading })

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext 