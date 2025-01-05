import React, { useState, useEffect } from 'react'
import AuthContext, { useAuth } from '../context/AuthContext'

export const useServices = () => {
  const { user } = useAuth()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const fetchServices = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'All') params.append('category', selectedCategory)
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`http://localhost:3000/api/services?${params.toString()}`, {
        credentials: 'include',
        headers: {
          'Authorization': user ? `Bearer ${user.token}` : ''
        }
      })
      if (!response.ok) throw new Error('Failed to fetch services')
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error('Error fetching services:', error)
      alert('Failed to fetch services')
    } finally {
      setLoading(false)
    }
  }

  const createService = async (serviceData) => {
    try {
      const response = await fetch('http://localhost:3000/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(serviceData),
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Failed to create service')
      const newService = await response.json()
      setServices(prev => [newService, ...prev])
      return true
    } catch (error) {
      console.error('Error creating service:', error)
      alert('Failed to create service')
      return false
    }
  }

  useEffect(() => {
    fetchServices()
  }, [searchQuery, selectedCategory])

  return {
    services,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    createService
  }
} 