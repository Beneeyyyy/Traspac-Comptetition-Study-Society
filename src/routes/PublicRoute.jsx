import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/layouts/Navbar';

const PublicRoute = () => {
  const { user } = useAuth();
  const isAuthPage = ['/login', '/signup'].includes(window.location.pathname);

  if (user && isAuthPage) {
    return <Navigate to="/dashboard" replace />;
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