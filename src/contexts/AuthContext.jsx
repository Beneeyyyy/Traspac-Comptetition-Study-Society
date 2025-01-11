import React from 'react';
import { createContext, useState, useContext, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create the context with a default value
const AuthContext = createContext({
  user: null,
  login: async () => {},
  logout: async () => {},
  checkAuth: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      console.log('Checking auth status...');
      const response = await fetch(`${API_URL}/api/auth/check-auth`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Auth check response:', data);

      if (response.ok && data.user) {
        console.log('Setting user data:', data.user);
        setUser(data.user);
      } else {
        console.log('No user data found');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login...');
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      if (data.user) {
        console.log('Setting user after login:', data.user);
        setUser(data.user);
        await checkAuth();
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setUser(null);
      }
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    console.log('AuthProvider mounted, checking auth...');
    checkAuth();

    const interval = setInterval(checkAuth, 5000);
    return () => clearInterval(interval);
  }, []);

  console.log('Current auth state:', { user });

  const value = React.useMemo(() => ({
    user,
    login,
    logout,
    checkAuth,
    isLoading
  }), [user, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 