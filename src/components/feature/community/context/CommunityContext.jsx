import React, { createContext, useContext, useReducer, useMemo, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../../../context/AuthContext'

const CommunityContext = createContext()

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

export const useCommunity = () => {
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
          if (action.payload.type === 'question' && question.id === action.payload.id) {
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
                answer.id === action.payload.id
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

export const CommunityProvider = ({ children }) => {
  const [state, dispatch] = useReducer(communityReducer, initialState)
  const { user: authUser } = useAuth() // Get user from AuthContext

  // Set current user from AuthContext
  useEffect(() => {
    if (authUser) {
      dispatch({ type: 'SET_CURRENT_USER', payload: authUser })
    }
  }, [authUser])

  // Fetch questions when component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      dispatch({ type: 'FETCH_QUESTIONS_START' })
      try {
        const response = await api.get('/forum/posts')
        // Extract posts array from response data
        const posts = response.data?.data?.posts || []
        dispatch({ type: 'FETCH_QUESTIONS_SUCCESS', payload: posts })
      } catch (error) {
        console.error('Error fetching questions:', error)
        dispatch({ type: 'FETCH_QUESTIONS_ERROR', payload: error.message })
      }
    }
    fetchQuestions()
  }, [])

  const value = useMemo(() => ({
    ...state,
    refreshQuestion: async (questionId) => {
      if (!questionId) {
        console.warn('Attempted to refresh question with undefined id');
        return null;
      }

      try {
        const response = await api.get(`/forum/posts/${questionId}`);
        if (!response.data?.success) {
          console.error('Failed to refresh question:', response.data?.error);
          return null;
        }

        const updatedQuestion = response.data?.data;
        if (updatedQuestion) {
          dispatch({
            type: 'REFRESH_QUESTION_SUCCESS',
            payload: updatedQuestion
          });
        }
        
        return updatedQuestion;
      } catch (error) {
        console.error('Error refreshing question:', error);
        return null;
      }
    },
    addAnswer: async (questionId, answer) => {
      try {
        const response = await api.post(`/forum/posts/${questionId}/answers`, {
          content: answer.content,
          images: answer.images || []
        })

        // Refresh question data to get the latest answers
        await value.refreshQuestion(questionId)

        return response.data?.data
      } catch (error) {
        console.error('Error adding answer:', error)
        throw error
      }
    },
    addQuestion: async (question) => {
      try {
        const response = await api.post('/forum/posts', question);
        
        if (response.data?.success) {
          // Dispatch success action with the new question
          dispatch({ 
            type: 'ADD_QUESTION_SUCCESS', 
            payload: response.data.data 
          });
          
          // Refresh the questions list
          const refreshResponse = await api.get('/forum/posts');
          if (refreshResponse.data?.success) {
            dispatch({ 
              type: 'FETCH_QUESTIONS_SUCCESS', 
              payload: refreshResponse.data.data.posts 
            });
          }
          
          return response.data.data;
        }
      } catch (error) {
        console.error('Error adding question:', error);
        throw error;
      }
    },
    acceptAnswer: async (questionId, answerId) => {
      try {
        const response = await api.post(`/forum/posts/${questionId}/answers/${answerId}/accept`)
        dispatch({
          type: 'ACCEPT_ANSWER_SUCCESS',
          payload: { questionId, answerId }
        })
        return response.data
      } catch (error) {
        console.error('Error accepting answer:', error)
        throw error
      }
    },
    addComment: async (questionId, answerId, comment) => {
      try {
        const endpoint = answerId 
          ? `/forum/answers/${answerId}/comments`
          : `/forum/posts/${questionId}/comments`
        
        const response = await api.post(endpoint, {
          content: comment.content,
          parentId: comment.parentId
        })
        
        dispatch({
          type: 'ADD_COMMENT_SUCCESS',
          payload: { 
            questionId, 
            answerId,
            comment: {
              ...response.data?.data,
              timeAgo: 'Just now',
              user: response.data?.data?.user || {
                name: 'You',
                image: '/avatars/default.png',
                rank: 'Member'
              }
            }
          }
        })
        return response.data
      } catch (error) {
        console.error('Error adding comment:', error)
        throw error
      }
    },
    updateVote: async (type, id, isUpvote) => {
      try {
        // Map type 'question' to 'post' for backend compatibility
        const mappedType = type === 'question' ? 'post' : type === 'answer' ? 'answer' : type
        
        // Fix: Use correct endpoint format
        const endpoint = `/forum/${mappedType}/${id}/vote`
        
        console.log('Sending vote request:', {
          endpoint,
          type: mappedType,
          id,
          isUpvote: Boolean(isUpvote)
        })

        const response = await api.post(endpoint, { 
          isUpvote: Boolean(isUpvote)
        })
        
        // Transform response for frontend
        const transformedData = {
          type,
          id: parseInt(id),
          upvoteCount: response.data?.data?.upvotes || 0,
          downvoteCount: response.data?.data?.downvotes || 0,
          userVote: response.data?.data?.userVote || null
        }
        
        dispatch({
          type: 'UPDATE_VOTE_SUCCESS',
          payload: transformedData
        })
        
        return transformedData
      } catch (error) {
        console.error('Error updating vote:', error.response || error)
        throw error
      }
    },
    createPost: async (postData) => {
      setIsLoading(true);
      setError(null);
      try {
        // Pastikan images adalah array
        const images = postData.images || [];
        
        // Kirim data dengan images yang sudah divalidasi
        const response = await api.post(`/forum/posts`, {
          ...postData,
          images: images.map(img => {
            // Jika image sudah berupa URL Cloudinary, gunakan langsung
            if (typeof img === 'string' && img.includes('cloudinary.com')) {
              return img;
            }
            // Jika image adalah object dengan data base64, ambil data-nya
            return img;
          })
        });

        if (response.data.success) {
          console.log('Post created with images:', response.data.data.images);
          // Refresh posts setelah membuat post baru
          await fetchPosts(1); // Kembali ke halaman pertama untuk melihat post terbaru
          return response.data.data;
        }
      } catch (err) {
        console.error('Error creating post:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }
  }), [state])

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  )
}

export default CommunityProvider 