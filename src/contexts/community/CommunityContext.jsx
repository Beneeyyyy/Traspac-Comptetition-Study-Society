import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSquads } from '@/api/squad';
import { toast } from 'react-hot-toast';
import { useAuth } from '../AuthContext';

const CommunityContext = createContext();

export const useSquads = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useSquads must be used within a CommunityProvider');
  }
  return context;
};

export const CommunityProvider = ({ children }) => {
  const { user } = useAuth();
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSquads = async () => {
      try {
        setLoading(true);
        const response = await getSquads();
        setSquads(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching squads:', err);
        setError(err.message);
        toast.error('Failed to load squads');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch squads if user is authenticated
    if (user) {
      fetchSquads();
    } else {
      setSquads([]);
      setLoading(false);
    }
  }, [user]); // Add user as dependency

  const value = {
    squads,
    loading,
    error,
    setSquads,
  };

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};

export default CommunityProvider; 