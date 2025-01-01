import React, { useContext } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('=== CHECK-AUTH START ===');
      console.log('API_URL:', API_URL);
      console.log('Making request to:', `${API_URL}/api/auth/check-auth`);
      
      const response = await fetch(`${API_URL}/api/auth/check-auth`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.log('Error response:', errorData);
          setUser(null);
          return;
        } else {
          console.error('Received non-JSON response:', await response.text());
          setUser(null);
          return;
        }
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.user) {
        console.log('Setting user data:', data.user);
        setUser(data.user);
      } else {
        console.log('No user data in response');
        setUser(null);
      }
      console.log('=== CHECK-AUTH END ===');
    } catch (error) {
      console.error('=== CHECK-AUTH ERROR ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('=== END ERROR ===');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('=== LOGIN START ===');
      console.log('Making login request to:', `${API_URL}/api/auth/login`);
      console.log('With credentials:', { email });
      
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        console.log('Login failed:', data.message);
        throw new Error(data.message || 'Login failed');
      }

      console.log('Setting user data:', data.user);
      setUser(data.user);
      console.log('=== LOGIN END ===');
      return data;
    } catch (error) {
      console.error('=== LOGIN ERROR ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('=== END ERROR ===');
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('=== LOGOUT START ===');
      console.log('Making logout request to:', `${API_URL}/api/auth/signout`);
      
      const response = await fetch(`${API_URL}/api/auth/signout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (response.ok) {
        console.log('Logout successful, clearing user data');
        setUser(null);
      } else {
        console.log('Logout failed:', response.statusText);
      }
      console.log('=== LOGOUT END ===');
    } catch (error) {
      console.error('=== LOGOUT ERROR ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('=== END ERROR ===');
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 