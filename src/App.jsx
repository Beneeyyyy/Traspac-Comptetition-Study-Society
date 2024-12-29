import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
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


function AppContent() {
  const location = useLocation()
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname.split('/')[1]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            
            <Route path='/dashboard' element={<LandingPage />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            
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
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function App() {
  return (
    <Router>
      <MotionConfig reducedMotion="user">
        <CommunityProvider>
          <AppContent />
        </CommunityProvider>
      </MotionConfig>
    </Router>
  )
}

export default App
