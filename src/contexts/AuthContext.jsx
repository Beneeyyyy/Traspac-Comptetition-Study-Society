import { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { initializeApi } from '../utils/api';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

// Create the context
export const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to get token
  const getToken = () => localStorage.getItem('token');

  // Initialize API with token getter
  useEffect(() => {
    initializeApi(getToken);
  }, []);

  const checkAuth = async () => {
    try {
      console.log('Checking auth status...');
      const response = await fetch(`${API_URL}/api/auth/check-auth`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        }
      });

      const data = await response.json();
      console.log('Auth check response:', data);

      if (response.ok && data.user) {
        console.log('Setting user data:', data.user);
        setUser(data.user);
        setError(null);
        // Update token if provided
        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        // If there's a redirect in the URL, navigate to it
        const params = new URLSearchParams(location.search);
        const redirect = params.get('redirect');
        if (redirect) {
          navigate(redirect);
        }
      } else {
        console.log('No user data found');
        setUser(null);
        setError('Authentication required');
        localStorage.removeItem('token');
        
        // Only redirect to login if not already there and not a public route
        const isPublicRoute = ['/login', '/signup', '/'].includes(location.pathname);
        if (!isPublicRoute) {
          navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setError(error.message);
      // Clear token on error
      localStorage.removeItem('token');
      setUser(null);
      
      // Only redirect to login if not already there and not a public route
      const isPublicRoute = ['/login', '/signup', '/'].includes(location.pathname);
      if (!isPublicRoute) {
        navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
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
        setError(null);
        // Store token in localStorage
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
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
        setError(null);
        // Remove token from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.message);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('AuthProvider mounted, checking auth...');
    // Try to get user from localStorage first
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing saved user:', e);
        localStorage.removeItem('user');
      }
    }
    // Then verify with server
    checkAuth();
  }, []); // Only run on mount

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const value = useMemo(() => ({
    user,
    login,
    logout,
    checkAuth,
    isLoading,
    error,
    getToken
  }), [user, isLoading, error]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext; 