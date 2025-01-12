import React from 'react';
import { createContext, useContext, useReducer, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Create the context
const CommunityContext = createContext(null);

// Custom hook to use the community context
export function useCommunity() {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
}

const initialState = {
  questions: [],
  communities: [],
  isLoading: false,
  error: null,
  currentUser: null
};

function communityReducer(state, action) {
  switch (action.type) {
    case 'FETCH_QUESTIONS_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_QUESTIONS_SUCCESS':
      return { ...state, isLoading: false, questions: action.payload };
    case 'FETCH_QUESTIONS_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'REFRESH_QUESTION_SUCCESS':
      return {
        ...state,
        questions: state.questions.map(q => 
          q.id === action.payload.id ? action.payload : q
        )
      };
    case 'SET_COMMUNITIES':
      return { ...state, communities: action.payload };
    case 'UPDATE_QUESTION':
      return {
        ...state,
        questions: state.questions.map(q => 
          q.id === action.payload.questionId ? action.payload.question : q
        )
      };
    default:
      return state;
  }
}

// Provider component
export function CommunityProvider({ children }) {
  const [state, dispatch] = useReducer(communityReducer, initialState);
  const { user: authUser, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && authUser) {
      dispatch({ type: 'SET_CURRENT_USER', payload: authUser });
    }
  }, [authUser, authLoading]);

  useEffect(() => {
    if (!authLoading) {
      const fetchQuestions = async () => {
        dispatch({ type: 'FETCH_QUESTIONS_START' });
        try {
          const response = await api.get('/api/forum/posts');
          const posts = response.data?.data?.posts || [];
          dispatch({ type: 'FETCH_QUESTIONS_SUCCESS', payload: posts });
        } catch (error) {
          console.error('Error fetching questions:', error);
          dispatch({ type: 'FETCH_QUESTIONS_ERROR', payload: error.message });
        }
      };
      fetchQuestions();
    }
  }, [authLoading]);

  const fetchCommunities = async () => {
    try {
      dispatch({ type: 'FETCH_QUESTIONS_START' });
      const response = await api.get('/api/communities');
      const communitiesData = Array.isArray(response.data.data) ? response.data.data : [];
      dispatch({ type: 'SET_COMMUNITIES', payload: communitiesData });
    } catch (error) {
      console.error('Error fetching communities:', error);
      dispatch({ type: 'FETCH_QUESTIONS_ERROR', payload: error.message });
    }
  };

  const joinCommunity = async (communityId) => {
    try {
      const response = await api.post(`/api/communities/${communityId}/join`);
      await fetchCommunities(); // Refresh communities list
      return response.data;
    } catch (error) {
      console.error('Error joining community:', error);
      throw error;
    }
  };

  const leaveCommunity = async (communityId) => {
    try {
      await api.post(`/api/communities/${communityId}/leave`);
      await fetchCommunities(); // Refresh communities list
    } catch (error) {
      console.error('Error leaving community:', error);
      throw error;
    }
  };

  // Define refreshQuestion outside the value object
  const refreshQuestion = async (questionId) => {
    if (!questionId) return null;
    try {
      const response = await api.get(`/api/forum/posts/${questionId}`);
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
  };

  const value = useMemo(() => ({
    ...state,
    refreshQuestion,
    addQuestion: async (title, content, tags = [], images = []) => {
      try {
        const response = await api.post('/api/forum/posts', { title, content, tags, images });
        const newQuestion = response.data?.data;
        if (newQuestion) {
          dispatch({
            type: 'FETCH_QUESTIONS_SUCCESS',
            payload: [...state.questions, newQuestion]
          });
        }
        return newQuestion;
      } catch (error) {
        console.error('Error creating question:', error);
        throw error;
      }
    },
    fetchCommunities,
    joinCommunity,
    leaveCommunity,
    updateVote: async (type, id, isUpvote) => {
      try {
        const response = await api.post(`/api/forum/${type}/${id}/vote`, { isUpvote });
        const updatedItem = response.data?.data;
        if (updatedItem) {
          dispatch({
            type: 'REFRESH_QUESTION_SUCCESS',
            payload: updatedItem
          });
        }
        return updatedItem;
      } catch (error) {
        console.error('Error updating vote:', error);
        throw error;
      }
    },
    addAnswer: async (questionId, content, images = []) => {
      try {
        const response = await api.post(`/api/forum/posts/${questionId}/answers`, {
          content,
          images
        });
        const updatedQuestion = response.data?.data;
        if (updatedQuestion) {
          dispatch({
            type: 'REFRESH_QUESTION_SUCCESS',
            payload: updatedQuestion
          });
        }
        return updatedQuestion;
      } catch (error) {
        console.error('Error adding answer:', error);
        throw error;
      }
    },
    addComment: async (questionId, answerId, data) => {
      try {
        const endpoint = answerId 
          ? `/api/forum/posts/${questionId}/answers/${answerId}/comments`
          : `/api/forum/posts/${questionId}/comments`;

        console.log('Sending comment to:', endpoint, 'with data:', data);
        const response = await api.post(endpoint, data);
        console.log('Response from server:', response.data);
        
        if (response.data?.success) {
          const updatedQuestion = response.data.data;
          console.log('Updated question structure:', {
            id: updatedQuestion.id,
            answers: updatedQuestion.answers?.map(a => ({
              id: a.id,
              comments: a.comments?.length
            }))
          });
          
          // Update questions state with new data
          dispatch({
            type: 'REFRESH_QUESTION_SUCCESS',
            payload: updatedQuestion
          });
          return response.data;
        }
      } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
      }
    }
  }), [state]);

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
}

export default CommunityContext; 