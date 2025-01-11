import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import LoadingScreen from '../components/common/LoadingScreen';

// Lazy loaded components
const Login = lazy(() => import('../components/feature/auth/Login').then(module => ({ default: module.Login })));
const Signup = lazy(() => import('../components/feature/auth/Signup'));
const LandingPage = lazy(() => import('../components/feature/LandingPage/LandingPage'));
const CommunityPage = lazy(() => import('../components/feature/community/CommunityPage'));
const Courses = lazy(() => import('../components/feature/courses/Courses'));
const SubCategoryPage = lazy(() => import('../components/feature/courses/subcategory/SubCategory'));
const MaterialsPage = lazy(() => import('../components/feature/courses/materials/MaterialsPage'));
const Leaderboard = lazy(() => import('../components/feature/leaderboard/Leaderboard'));
const UpCreation = lazy(() => import('../components/feature/upcreation/UpCreation'));
const UpService = lazy(() => import('../components/feature/upservice/UpService'));
const LearningPage = lazy(() => import('../components/feature/courses/materials/learning/LearningPage'));

const AppRoutes = () => {
  const { user } = useAuth();
  const location = useLocation();

  // If user is not authenticated and not on a public route, redirect to login
  if (!user && !location.pathname.match(/^\/(login|signup)?$/)) {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

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
          <Route path="upcreation" element={<UpCreation />} />
          <Route path="upservices" element={<UpService />} />
          
          {/* Courses Routes */}
          <Route path="courses">
            <Route index element={<Courses />} />
            <Route path=":categoryId" element={<SubCategoryPage />} />
            <Route path=":categoryId/subcategory/:subcategoryId" element={<MaterialsPage />} />
            <Route path=":categoryId/subcategory/:subcategoryId/learn/:materialId/*" element={<LearningPage />} />
          </Route>
          
          {/* Community Routes */}
          <Route path="community/*" element={<CommunityPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes; 