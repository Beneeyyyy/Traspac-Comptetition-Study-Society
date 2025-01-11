import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import LoadingScreen from '../components/common/LoadingScreen';

// Lazy loaded components
const Login = lazy(() => import('../components/feature/auth/Login'));
const Signup = lazy(() => import('../components/feature/auth/Signup'));
const LandingPage = lazy(() => import('../components/feature/LandingPage/LandingPage'));
const CommunityPage = lazy(() => import('../components/feature/community/CommunityPage'));
const Courses = lazy(() => import('../components/feature/courses/Courses'));
const SubCategoryPage = lazy(() => import('../components/feature/courses/subcategory/SubCategory'));
const MaterialsPage = lazy(() => import('../components/feature/courses/materials/MaterialsPage'));
const Leaderboard = lazy(() => import('../components/feature/leaderboard/Leaderboard'));

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        {/* Protected Routes */}
        <Route path="/" element={<PrivateRoute />}>
          <Route path="dashboard" element={<LandingPage />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          
          {/* Courses Routes */}
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:categoryId" element={<SubCategoryPage />} />
          <Route path="courses/:categoryId/:subcategoryId" element={<MaterialsPage />} />
          
          {/* Community Routes */}
          <Route path="community/*" element={<CommunityPage />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes; 