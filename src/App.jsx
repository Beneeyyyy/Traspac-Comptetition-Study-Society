import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { CourseProvider } from './contexts/CourseContext'
import { ForumProvider } from './contexts/forum/ForumContext'
import { CommunityProvider } from '@/contexts/community/CommunityContext'
import { LeaderboardProvider } from './contexts/LeaderboardContext'
import { AnimatePresence, LazyMotion, domAnimation } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes'
import SquadMaterialView from './components/feature/community/squad/material/SquadMaterialView'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

const App = () => {
  return (
    <LazyMotion features={domAnimation}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <CourseProvider>
              <ForumProvider>
                <CommunityProvider>
                  <LeaderboardProvider>
                    <AnimatePresence mode="wait">
                      <AppRoutes />
                    </AnimatePresence>
                    <Toaster position="top-right" />
                  </LeaderboardProvider>
                </CommunityProvider>
              </ForumProvider>
            </CourseProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </LazyMotion>
  )
}

export default App
