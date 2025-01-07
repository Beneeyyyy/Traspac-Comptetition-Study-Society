import { Routes, Route, useLocation } from 'react-router-dom';
import { CommunityProvider } from '../components/feature/community/context/CommunityContext';
import Navbar from '../components/layouts/Navbar';
import LandingPage from '../components/feature/LandingPage/LandingPage';
import Login from '../components/feature/auth/Login';
import Signup from '../components/feature/auth/Signup';
import Courses from '../components/feature/courses/Courses';
import SubcategoryPage from '../components/feature/courses/subcategory/subCategory';
import MaterialsPage from '../components/feature/courses/materials/Materials';
import LearningPage from '../components/feature/courses/materials/learning/LearningPage';
import CommunityPage from '../components/feature/community/Community';
import SquadDetail from '../components/feature/community/components/squadDetail/SquadDetail';
import UpCreation from '../components/feature/upcreation/UpCreation';
import UpService from '../components/feature/upservice/UpService';
import Leaderboard from '../components/feature/leaderboard/Leaderboard';
import Profile from '../components/feature/profile/Profile';
import AdminDashboard from '../pages/admin/Dashboard';
import CategoryManagement from '../pages/admin/CategoryManagement';
import UserManagement from '../pages/admin/UserManagement';
import SubcategoryManagement from '../pages/admin/SubcategoryManagement';
import MaterialManagement from '../pages/admin/MaterialManagement';
import Dashboard from '../pages/Dashboard';
import { PrivateRoute } from '../components/common/PrivateRoute';

const AppRoutes = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  const isCommunityPage = location.pathname.startsWith('/community');

  return (
    <div className="min-h-screen">
      {!isAuthPage && <Navbar />}
      <div className="relative">
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path='/dashboard' element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/courses" element={<Courses />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Learning Flow Routes */}
          <Route path="/courses/:categoryId/subcategory" element={<SubcategoryPage />} />
          <Route path="/courses/:categoryId/subcategory/:subcategoryId/materials" element={<MaterialsPage />} />
          <Route path="/courses/:categoryId/subcategory/:subcategoryId/learn/:materialId/*" element={<LearningPage />} />
          
          {/* Community Routes */}
          <Route path="/community" element={
            <CommunityProvider>
              <CommunityPage />
            </CommunityProvider>
          } />
          <Route path="/community/explore" element={
            <CommunityProvider>
              <CommunityPage />
            </CommunityProvider>
          } />
          <Route path="/community/squad/:squadId" element={
            <CommunityProvider>
              <SquadDetail />
            </CommunityProvider>
          } />

          {/* Other Routes */}
          <Route path="/upcreation" element={<UpCreation />} />
          <Route path="/upservice" element={<UpService />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
          <Route path="/admin/subcategories" element={<SubcategoryManagement />} />
          <Route path="/admin/materials" element={<MaterialManagement />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default AppRoutes; 