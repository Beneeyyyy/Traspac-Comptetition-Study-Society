import { useScroll, useSpring } from 'framer-motion'
import { useRef, useEffect } from 'react'

export const useScrollAnimation = () => {
  const containerRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    container: containerRef,
    offset: ["start start", "end end"]
  })
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    // Set container ref to window if no specific container
    if (!containerRef.current) {
      containerRef.current = window
    }
  }, [])

  return {
    scaleX,
    containerRef
  }
} 