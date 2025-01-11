import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/layouts/Navbar';

const PrivateRoute = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="relative">
        <Outlet />
      </div>
    </div>
  );
};

export default PrivateRoute; 