import { createContext, useContext, useState } from 'react'

const SquadContext = createContext()

export const SquadProvider = ({ children }) => {
  const [squadData, setSquadData] = useState({
    // Overview data
    about: '',
    rules: [],
    leaders: [],

    // Learning data
    learningPaths: [],

    // Discussion data
    discussionSettings: {
      allowComments: true,
      allowFiles: true,
      moderationEnabled: false
    }
  })

  const updateSquadData = (section, data) => {
    console.log('Updating squad data:', section, data) // Debug log
    setSquadData(prev => ({
      ...prev,
      [section]: data
    }))
  }

  const addAssignmentToPath = (pathId, assignment) => {
    console.log('Adding assignment to path:', pathId, assignment) // Debug log
    
    setSquadData(prev => {
      const updatedPaths = prev.learningPaths.map(path => {
        if (path.id === pathId) {
          return {
            ...path,
            assignments: [...(path.assignments || []), assignment]
          }
        }
        return path
      })

      console.log('Updated learning paths:', updatedPaths) // Debug log
      
      return {
        ...prev,
        learningPaths: updatedPaths
      }
    })
  }

  const value = {
    squadData,
    updateSquadData,
    addAssignmentToPath
  }

  return (
    <SquadContext.Provider value={value}>
      {children}
    </SquadContext.Provider>
  )
}

export const useSquad = () => {
  const context = useContext(SquadContext)
  if (!context) {
    throw new Error('useSquad must be used within a SquadProvider')
  }
  return context
}

export default SquadContext 