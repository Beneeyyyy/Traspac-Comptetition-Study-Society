import { createContext, useContext, useReducer } from 'react'

const CommunityContext = createContext()

const initialState = {
  questions: [],
  isLoading: false,
  error: null
}

const communityReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload }
    
    case 'ADD_QUESTION':
      return { 
        ...state, 
        questions: [action.payload, ...state.questions]
      }
    
    case 'ADD_ANSWER':
      return {
        ...state,
        questions: state.questions.map(question => 
          question.id === action.payload.questionId
            ? {
                ...question,
                answers: [...(question.answers || []), action.payload.answer]
              }
            : question
        )
      }

    case 'ADD_COMMENT': {
      return {
        ...state,
        questions: state.questions.map(question => {
          if (question.id === action.payload.questionId) {
            return {
              ...question,
              answers: question.answers.map(answer => {
                if (answer.id === action.payload.answerId) {
                  const newComment = action.payload.comment
                  
                  if (newComment.parentId) {
                    return {
                      ...answer,
                      comments: answer.comments.map(comment => {
                        if (comment.id === newComment.parentId) {
                          return {
                            ...comment,
                            replies: [...(comment.replies || []), newComment]
                          }
                        }
                        return comment
                      })
                    }
                  }
                  
                  return {
                    ...answer,
                    comments: [...(answer.comments || []), newComment]
                  }
                }
                return answer
              })
            }
          }
          return question
        })
      }
    }

    case 'UPDATE_VOTE':
      return {
        ...state,
        questions: state.questions.map(question => {
          if (action.payload.type === 'question' && question.id === action.payload.id) {
            return { ...question, votes: question.votes + action.payload.value }
          }
          if (action.payload.type === 'answer') {
            return {
              ...question,
              answers: question.answers.map(answer =>
                answer.id === action.payload.id
                  ? { ...answer, votes: answer.votes + action.payload.value }
                  : answer
              )
            }
          }
          return question
        })
      }

    default:
      return state
  }
}

export const CommunityProvider = ({ children }) => {
  const [state, dispatch] = useReducer(communityReducer, initialState)

  const addQuestion = (question) => {
    dispatch({ type: 'ADD_QUESTION', payload: {
      id: Date.now(),
      user: {
        name: 'You',
        avatar: '/avatars/default.png',
        badge: 'Member'
      },
      votes: 0,
      answers: [],
      views: 0,
      timeAgo: 'Baru saja',
      ...question
    }})
  }

  const addAnswer = (questionId, answer) => {
    dispatch({
      type: 'ADD_ANSWER',
      payload: {
        questionId,
        answer: {
          id: Date.now(),
          user: {
            name: 'You',
            avatar: '/avatars/default.png',
            badge: 'Member'
          },
          votes: 0,
          timeAgo: 'Baru saja',
          comments: [],
          ...answer
        }
      }
    })
  }

  const addComment = (questionId, answerId, comment) => {
    dispatch({
      type: 'ADD_COMMENT',
      payload: {
        questionId,
        answerId,
        comment: {
          id: Date.now(),
          user: {
            name: 'You',
            avatar: '/avatars/default.png'
          },
          timeAgo: 'Baru saja',
          likes: 0,
          replies: [],
          ...comment
        }
      }
    })
  }

  const updateVote = (type, id, value) => {
    dispatch({
      type: 'UPDATE_VOTE',
      payload: { type, id, value }
    })
  }

  const value = {
    ...state,
    dispatch,
    addQuestion,
    addAnswer,
    addComment,
    updateVote
  }

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  )
}

export const useCommunity = () => {
  const context = useContext(CommunityContext)
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider')
  }
  return context
} 