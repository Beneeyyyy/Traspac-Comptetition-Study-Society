import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create context
const CommunityContext = createContext();

// Custom hook to use the community context
export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};

// Provider component
export const CommunityProvider = ({ children }) => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/api/communities`, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      // Log the raw response
      console.log('API Response:', response);
      
      // Ensure we're setting an array
      const communitiesData = Array.isArray(response.data.data) ? response.data.data : [];
      setCommunities(communitiesData);
    } catch (err) {
      console.error('Error fetching communities:', err.response || err);
      setError(err.response?.data?.message || 'Failed to load communities');
      setCommunities([]);
    } finally {
      setLoading(false);
    }
  };

  const joinCommunity = async (communityId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_URL}/api/communities/${communityId}/join`, {}, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      // Update the specific community in the list
      setCommunities(prevCommunities => 
        prevCommunities.map(community => 
          community.id === communityId 
            ? { ...community, ...response.data.data }
            : community
        )
      );
      
      return response.data;
    } catch (err) {
      console.error('Error joining community:', err.response || err);
      setError(err.response?.data?.message || 'Failed to join community');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const leaveCommunity = async (communityId) => {
    try {
      setLoading(true);
      setError(null);
      await axios.post(`${API_URL}/api/communities/${communityId}/leave`, {}, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      // Remove the community from the list
      setCommunities(prevCommunities => 
        prevCommunities.filter(community => community.id !== communityId)
      );
    } catch (err) {
      console.error('Error leaving community:', err.response || err);
      setError(err.response?.data?.message || 'Failed to leave community');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    communities,
    loading,
    error,
    fetchCommunities,
    joinCommunity,
    leaveCommunity
  };

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};

export default CommunityContext; 