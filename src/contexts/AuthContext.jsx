import React, { createContext, useContext, useState, useCallback } from 'react'
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

const AuthContext = createContext(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const login = useCallback(async (email, password) => {
    try {
      setError(null)
      const response = await api.post('/api/auth/login', { email, password })
      setUser(response.data.user)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login')
      throw err
    }
  }, [])

  const signup = useCallback(async (userData) => {
    try {
      setError(null)
      const response = await api.post('/api/auth/signup', userData)
      setUser(response.data.user)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to signup')
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout')
      setUser(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to logout')
      throw err
    }
  }, [])

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/auth/me')
      setUser(response.data.user)
    } catch (err) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext 