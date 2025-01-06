import React, { createContext, useContext, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
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

const CommunityContext = createContext(null)

export function useCommunity() {
  const context = useContext(CommunityContext)
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider')
  }
  return context
}

export function CommunityProvider({ children }) {
  const { user } = useAuth()
  const [squads, setSquads] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchSquads = useCallback(async () => {
    if (!user) return
    
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/api/squads')
      setSquads(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch squads')
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  const createSquad = useCallback(async (squadData) => {
    if (!user) throw new Error('User must be logged in')

    try {
      setError(null)
      const response = await api.post('/api/squads', squadData)
      setSquads(prev => [...prev, response.data])
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create squad')
      throw err
    }
  }, [user])

  const joinSquad = useCallback(async (squadId) => {
    if (!user) throw new Error('User must be logged in')

    try {
      setError(null)
      const response = await api.post(`/api/squads/${squadId}/join`)
      setSquads(prev => prev.map(squad => 
        squad.id === squadId ? response.data : squad
      ))
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join squad')
      throw err
    }
  }, [user])

  const leaveSquad = useCallback(async (squadId) => {
    if (!user) throw new Error('User must be logged in')

    try {
      setError(null)
      await api.post(`/api/squads/${squadId}/leave`)
      setSquads(prev => prev.filter(squad => squad.id !== squadId))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to leave squad')
      throw err
    }
  }, [user])

  const value = {
    squads,
    loading,
    error,
    fetchSquads,
    createSquad,
    joinSquad,
    leaveSquad
  }

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  )
}

export default CommunityContext 