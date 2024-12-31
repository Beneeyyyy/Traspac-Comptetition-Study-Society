import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/check-auth', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log('Auth check response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          setUser(null);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Auth check response data:', data);
      setUser(data.user);
      
    } catch (err) {
      console.error('Error checking auth status:', err);
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleSignOut = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/signout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setUser(null);
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  if (loading) {
    return <div className="bg-gray-900 text-white p-4">Loading...</div>;
  }

  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">StudySociety</Link>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
              <div className="flex items-center space-x-2">
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <button 
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition duration-200"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300 transition duration-200">Login</Link>
              <Link 
                to="/signup" 
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded transition duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 