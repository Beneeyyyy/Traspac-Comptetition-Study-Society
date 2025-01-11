import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/layouts/Navbar';

const PublicRoute = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  // Only redirect to dashboard if user is on auth pages
  if (user && isAuthPage) {
    // Get the intended destination from state, or default to dashboard
    const from = location.state?.from || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen">
      {!isAuthPage && <Navbar />}
      <div className="relative">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicRoute; 