import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { CourseProvider } from './contexts/CourseContext'
import { ForumProvider } from './contexts/forum/ForumContext'
import { CommunityProvider } from '@/contexts/community/CommunityContext'
import { LeaderboardProvider } from './contexts/LeaderboardContext'
import { AnimatePresence, LazyMotion, domAnimation } from 'framer-motion'
import AppRoutes from './routes'

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
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CourseProvider>
              <ForumProvider>
                <CommunityProvider>
                  <LeaderboardProvider>
                    <AnimatePresence mode="wait">
                      <AppRoutes />
                    </AnimatePresence>
                  </LeaderboardProvider>
                </CommunityProvider>
              </ForumProvider>
            </CourseProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </LazyMotion>
  )
}

export default App
