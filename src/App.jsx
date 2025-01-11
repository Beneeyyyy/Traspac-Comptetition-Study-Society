import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { CommunityProvider } from './contexts/CommunityContext'
import { CourseProvider } from './contexts/CourseContext'
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
              <LeaderboardProvider>
                <CommunityProvider>
                  <AnimatePresence mode="wait">
                    <AppRoutes />
                  </AnimatePresence>
                </CommunityProvider>
              </LeaderboardProvider>
            </CourseProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </LazyMotion>
  )
}

export default App
