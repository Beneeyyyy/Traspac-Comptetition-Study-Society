import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import LandingPage from './components/feature/LandingPage/LandingPage'
import Courses from './components/feature/courses/Courses'
import SubcategoryPage from './components/feature/courses/subcategory/subCategory'
import MaterialsPage from './components/feature/courses/materials/Materials'
import LearningPage from './components/feature/courses/materials/learning/LearningPage'
import CommunityPage from './components/feature/community/Community'
import SquadDetail from './components/feature/community/components/squadDetail/SquadDetail'
import UpCreation from './components/feature/upcreation/UpCreation'
import UpService from './components/feature/upservice/UpService'
import AdminDashboard from './pages/admin/Dashboard'
import CategoryManagement from './pages/admin/CategoryManagement'
import UserManagement from './pages/admin/UserManagement'
import SubcategoryManagement from './pages/admin/SubcategoryManagement'
import MaterialManagement from './pages/admin/MaterialManagement'
import Navbar from './components/layouts/Navbar'
import Leaderboard from './components/feature/leaderboard/Leaderboard'
import { CommunityProvider } from './components/feature/community/context/CommunityContext'
import Profile from './components/feature/profile/Profile'
import Login from './components/feature/auth/Login'
import Signup from './components/feature/auth/Signup'
import TestDiscussion from './components/feature/courses/materials/learning/components/content/discussion/TestDiscussion'

function AppContent() {
  const location = useLocation()
  const isAuthPage = ['/login', '/signup'].includes(location.pathname)
  
  return (
    <div className="min-h-screen">
      {!isAuthPage && <Navbar />}
      <div className="relative">
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path='/dashboard' element={<LandingPage />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Learning Flow Routes */}
          <Route path="/courses/:categoryId/subcategory" element={<SubcategoryPage />} />
          <Route path="/courses/:categoryId/subcategory/:subcategoryId/materials" element={<MaterialsPage />} />
          <Route path="/courses/:categoryId/subcategory/:subcategoryId/learn/:materialId/*" element={<LearningPage />} />
          
          {/* Community Routes */}
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/explore" element={<CommunityPage />} />
          <Route path="/community/squad/:squadId" element={<SquadDetail />} />

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

          <Route path="/test-discussion/:materialId" element={<TestDiscussion />} />
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <CommunityProvider>
        <MotionConfig reducedMotion="user">
          <AppContent />
        </MotionConfig>
      </CommunityProvider>
    </Router>
  )
}

export default App
