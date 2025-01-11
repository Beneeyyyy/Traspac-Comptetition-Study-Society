import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Check auth status when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/check-auth', {
          credentials: 'include'
        });
        
        if (response.ok) {
          // If already authenticated, redirect to dashboard or previous location
          const from = location.state?.from || '/dashboard';
          navigate(from);
        }
      } catch (error) {
        // Only log actual errors (network issues, server down, etc)
        if (!error.response || error.response.status !== 401) {
          console.error('Auth check error:', error);
        }
      }
    };

    checkAuth();
  }, [navigate, location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      const from = location.state?.from || '/dashboard';
      navigate(from);
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-4">
      {/* Header with GIF */}
      <div className="text-center mb-6">
        <img 
          src="https://media.giphy.com/media/E8wAYmqKWPTO64G5pG/giphy.gif" 
          alt="Study animation"
          className="w-40 mx-auto mb-3"
        />
        <h2 className="text-xl font-medium text-gray-300">
          Welcome back to study society
        </h2>
        {location.state?.message && (
          <p className="mt-2 text-sm text-indigo-400">{location.state.message}</p>
        )}
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md bg-black/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-800/50 shadow-2xl">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="h-10 text-sm appearance-none relative block w-full px-3 border border-gray-700/50 bg-gray-800/30 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-transparent transition-colors"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="h-10 text-sm appearance-none relative block w-full px-3 border border-gray-700/50 bg-gray-800/30 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-transparent transition-colors"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-700/50 bg-gray-800/30 text-indigo-500 focus:ring-indigo-500/50"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>

          <div className="text-center mt-4">
            <span className="text-gray-400 text-sm">Don't have an account?</span>
            <Link to="/signup" className="ml-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 