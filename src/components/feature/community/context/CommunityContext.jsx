import React, { createContext, useContext, useReducer, useMemo, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../../../contexts/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Create context with default value
const CommunityContext = createContext({
  questions: [],
  isLoading: false,
  error: null,
  currentUser: null,
  refreshQuestion: async () => {},
  addAnswer: async () => {},
  addQuestion: async () => {},
  updateVote: async () => {}
})

export function useCommunity() {
  const context = useContext(CommunityContext)
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider')
  }
  return context
}

const initialState = {
  questions: [],
  isLoading: false,
  error: null,
  currentUser: null
}

const communityReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return {
        ...state,
        currentUser: action.payload
      }
    case 'FETCH_QUESTIONS_START':
      return {
        ...state,
        isLoading: true,
        error: null
      }
    case 'FETCH_QUESTIONS_SUCCESS':
      return {
        ...state,
        questions: action.payload,
        isLoading: false
      }
    case 'FETCH_QUESTIONS_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    case 'REFRESH_QUESTION_SUCCESS':
      return {
        ...state,
        questions: state.questions.map(question =>
          question.id === action.payload.id
            ? action.payload
            : question
        )
      }
    case 'ADD_QUESTION_SUCCESS':
      return {
        ...state,
        questions: [action.payload, ...state.questions]
      }
    case 'ADD_ANSWER_SUCCESS':
      return {
        ...state,
        questions: state.questions.map(question =>
          question.id === action.payload.questionId
            ? { 
                ...question, 
                answers: [
                  ...(question.answers || []),
                  {
                    ...action.payload.answer,
                    questionId: question.id,
                    createdAt: new Date().toISOString()
                  }
                ]
              }
            : question
        )
      }
    case 'ADD_COMMENT_SUCCESS':
      return {
        ...state,
        questions: state.questions.map(question => {
          if (action.payload.questionId === question.id) {
            // If answerId exists, add comment to the answer
            if (action.payload.answerId) {
              return {
                ...question,
                answers: (question.answers || []).map(answer => 
                  answer.id === action.payload.answerId
                    ? {
                        ...answer,
                        comments: [...(answer.comments || []), action.payload.comment]
                      }
                    : answer
                )
              }
            }
            // Otherwise add comment to the question
            return {
              ...question,
              comments: [...(question.comments || []), action.payload.comment]
            }
          }
          return question
        })
      }
    case 'UPDATE_VOTE_SUCCESS':
      return {
        ...state,
        questions: state.questions.map(question => {
          if (action.payload.type === 'post' && question.id === parseInt(action.payload.id)) {
            return {
              ...question,
              upvoteCount: action.payload.upvoteCount,
              downvoteCount: action.payload.downvoteCount,
              userVote: action.payload.userVote
            }
          }
          if (action.payload.type === 'answer') {
            return {
              ...question,
              answers: (question.answers || []).map(answer => 
                answer.id === parseInt(action.payload.id)
                  ? {
                      ...answer,
                      upvoteCount: action.payload.upvoteCount,
                      downvoteCount: action.payload.downvoteCount,
                      userVote: action.payload.userVote
                    }
                  : answer
              )
            }
          }
          return question
        })
      }
    case 'ACCEPT_ANSWER_SUCCESS':
      return {
        ...state,
        questions: state.questions.map(question => {
          if (question.id === action.payload.questionId) {
            return {
              ...question,
              answers: (question.answers || []).map(answer => ({
                ...answer,
                isAccepted: answer.id === action.payload.answerId
              }))
            }
          }
          return question
        })
      }
    default:
      return state
  }
}

export function CommunityProvider({ children }) {
  const [state, dispatch] = useReducer(communityReducer, initialState)
  const { user: authUser, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && authUser) {
      dispatch({ type: 'SET_CURRENT_USER', payload: authUser })
    }
  }, [authUser, authLoading])

  useEffect(() => {
    if (!authLoading) {
      const fetchQuestions = async () => {
        dispatch({ type: 'FETCH_QUESTIONS_START' })
        try {
          const response = await api.get('/api/forum/posts')
          const posts = response.data?.data?.posts || []
          dispatch({ type: 'FETCH_QUESTIONS_SUCCESS', payload: posts })
        } catch (error) {
          console.error('Error fetching questions:', error)
          dispatch({ type: 'FETCH_QUESTIONS_ERROR', payload: error.message })
        }
      }
      fetchQuestions()
    }
  }, [authLoading])

  const value = useMemo(() => ({
    ...state,
    refreshQuestion: async (questionId) => {
      if (!questionId) return null
      try {
        const response = await api.get(`/api/forum/posts/${questionId}`)
        const updatedQuestion = response.data?.data
        if (updatedQuestion) {
          dispatch({
            type: 'REFRESH_QUESTION_SUCCESS',
            payload: updatedQuestion
          })
        }
        return updatedQuestion
      } catch (error) {
        console.error('Error refreshing question:', error)
        return null
      }
    },
    addAnswer: async (questionId, answer) => {
      try {
        const response = await api.post(`/api/forum/posts/${questionId}/answers`, {
          content: answer.content,
          images: answer.images || []
        })
        const newAnswer = response.data?.data
        if (newAnswer) {
          dispatch({
            type: 'ADD_ANSWER_SUCCESS',
            payload: { questionId, answer: newAnswer }
          })
        }
        return newAnswer
      } catch (error) {
        console.error('Error adding answer:', error)
        throw error
      }
    },
    addQuestion: async (question) => {
      try {
        const response = await api.post('/api/forum/posts', question)
        const newQuestion = response.data?.data
        if (newQuestion) {
          dispatch({
            type: 'ADD_QUESTION_SUCCESS',
            payload: newQuestion
          })
        }
        return newQuestion
      } catch (error) {
        console.error('Error adding question:', error)
        throw error
      }
    },
    updateVote: async (type, id, isUpvote) => {
      try {
        const response = await api.post(`/api/forum/${type}/${id}/vote`, { isUpvote })
        const { upvotes, downvotes, userVote } = response.data?.data || {}
        
        dispatch({
          type: 'UPDATE_VOTE_SUCCESS',
          payload: {
            type,
            id,
            upvoteCount: upvotes,
            downvoteCount: downvotes,
            userVote
          }
        })
        
        return response.data?.data
      } catch (error) {
        console.error('Error updating vote:', error)
        throw new Error(error.response?.data?.error || 'Failed to update vote')
      }
    }
  }), [state])

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  )
}

export default CommunityContext 