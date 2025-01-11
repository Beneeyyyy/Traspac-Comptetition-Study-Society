import React from 'react';
import { createContext, useState, useContext, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create the context
const LeaderboardContext = createContext(null);

// Custom hook to use the leaderboard context
export function useLeaderboard() {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error('useLeaderboard must be used within a LeaderboardProvider');
  }
  return context;
}

// Provider component
export function LeaderboardProvider({ children }) {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [timeframe, setTimeframe] = useState('weekly');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboard = async (selectedTimeframe = timeframe) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/leaderboard/${selectedTimeframe}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch leaderboard data');
      const data = await response.json();
      console.log('Leaderboard data fetched:', data);
      setLeaderboardData(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserRank = async () => {
    try {
      const response = await fetch(`${API_URL}/api/leaderboard/rank`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch user rank');
      const data = await response.json();
      console.log('User rank fetched:', data);
      setUserRank(data);
    } catch (error) {
      console.error('Error fetching user rank:', error);
      setError(error.message);
    }
  };

  // Fetch leaderboard when timeframe changes
  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  // Initial user rank fetch
  useEffect(() => {
    fetchUserRank();
  }, []);

  const value = React.useMemo(() => ({
    leaderboardData,
    userRank,
    timeframe,
    isLoading,
    error,
    setTimeframe,
    fetchLeaderboard,
    fetchUserRank,
  }), [leaderboardData, userRank, timeframe, isLoading, error]);

  return (
    <LeaderboardContext.Provider value={value}>
      {children}
    </LeaderboardContext.Provider>
  );
}

export default LeaderboardContext; 