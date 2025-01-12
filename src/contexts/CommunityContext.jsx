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

// Initial state
const initialState = {
  questions: [],
  communities: [],
  isLoading: false,
  error: null,
  currentUser: null
};

// Action types
const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  SET_USER: 'SET_USER',
  REFRESH_QUESTION: 'REFRESH_QUESTION',
  SET_COMMUNITIES: 'SET_COMMUNITIES',
  UPDATE_QUESTION: 'UPDATE_QUESTION',
  UPDATE_ANSWER: 'UPDATE_ANSWER'
};

// Reducer
function communityReducer(state, action) {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, isLoading: true, error: null };
    case ACTIONS.FETCH_SUCCESS:
      return { ...state, isLoading: false, questions: action.payload };
    case ACTIONS.FETCH_ERROR:
      return { ...state, isLoading: false, error: action.payload };
    case ACTIONS.SET_USER:
      return { ...state, currentUser: action.payload };
    case ACTIONS.REFRESH_QUESTION:
      return {
        ...state,
        questions: state.questions.map(q => 
          q.id === action.payload.id ? action.payload : q
        )
      };
    case ACTIONS.SET_COMMUNITIES:
      return { ...state, communities: action.payload };
    case ACTIONS.UPDATE_QUESTION:
      return {
        ...state,
        questions: state.questions.map(q => 
          q.id === action.payload.id ? action.payload : q
        )
      };
    case ACTIONS.UPDATE_ANSWER:
      return {
        ...state,
        questions: state.questions.map(q => {
          if (q.id === action.payload.postId) {
            return {
              ...q,
              answers: q.answers.map(a =>
                a.id === action.payload.answerId 
                  ? {
                      ...a,
                      ...action.payload.answer,
                      // Preserve these values to prevent UI flicker
                      upvotes: action.payload.answer.upvotes ?? a.upvotes,
                      downvotes: action.payload.answer.downvotes ?? a.downvotes,
                      userVote: action.payload.answer.userVote ?? a.userVote,
                      score: (action.payload.answer.upvotes ?? a.upvotes) - 
                            (action.payload.answer.downvotes ?? a.downvotes)
                    }
                  : a
              )
            };
          }
          return q;
        })
      };
    default:
      return state;
  }
}

// Provider component
export function CommunityProvider({ children }) {
  const [state, dispatch] = useReducer(communityReducer, initialState);
  const { user: authUser, loading: authLoading } = useAuth();

  // Effect to set user
  useEffect(() => {
    if (!authLoading && authUser) {
      dispatch({ type: ACTIONS.SET_USER, payload: authUser });
    }
  }, [authUser, authLoading]);

  // Effect to fetch initial questions
  useEffect(() => {
    if (!authLoading) {
      fetchQuestions();
    }
  }, [authLoading]);

  // Question related functions
  const fetchQuestions = async () => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const response = await api.get('/api/forum/posts');
      const posts = response.data?.data?.posts || [];
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: posts });
    } catch (error) {
      console.error('Error fetching questions:', error);
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
    }
  };

  const refreshQuestion = async (questionId) => {
    try {
      const response = await api.get(`/api/forum/posts/${questionId}`);
      if (response.data?.success) {
        const updatedQuestion = response.data.data;
        dispatch({
          type: ACTIONS.REFRESH_QUESTION,
          payload: updatedQuestion
        });
        return updatedQuestion;
      }
      throw new Error(response.data?.error || 'Failed to refresh question');
    } catch (error) {
      console.error('Error refreshing question:', error);
      throw error;
    }
  };

  const addQuestion = async (title, content, tags = [], images = []) => {
    try {
      const response = await api.post('/api/forum/posts', { 
        title, content, tags, images 
      });
      if (response.data?.success) {
        const newQuestion = response.data.data;
        dispatch({
          type: ACTIONS.FETCH_SUCCESS,
          payload: [...state.questions, newQuestion]
        });
        return newQuestion;
      }
      throw new Error(response.data?.error || 'Failed to add question');
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  };

  // Vote related functions
  const handleVote = async (type, id, isUpvote) => {
    try {
      if (!type || !id) {
        throw new Error('Missing required parameters');
      }

      // Find current answer
      const currentAnswer = state.questions
        .flatMap(q => q.answers)
        .find(a => a.id === parseInt(id));

      if (!currentAnswer) {
        throw new Error('Answer not found');
      }

      const postId = state.questions.find(q => 
        q.answers.some(a => a.id === parseInt(id))
      )?.id;

      // Simple vote count update
      const currentUpvotes = currentAnswer.upvotes || 0;
      const currentDownvotes = currentAnswer.downvotes || 0;
      const currentVote = currentAnswer.userVote;

      let newUpvotes = currentUpvotes;
      let newDownvotes = currentDownvotes;
      let newUserVote = isUpvote ? 'upvote' : 'downvote';

      // If clicking the same vote type, remove the vote
      if ((isUpvote && currentVote === 'upvote') || (!isUpvote && currentVote === 'downvote')) {
        newUpvotes = isUpvote ? currentUpvotes - 1 : currentUpvotes;
        newDownvotes = !isUpvote ? currentDownvotes - 1 : currentDownvotes;
        newUserVote = null;
      } 
      // If changing vote type
      else if (currentVote) {
        newUpvotes = isUpvote ? currentUpvotes + 1 : currentUpvotes - 1;
        newDownvotes = isUpvote ? currentDownvotes - 1 : currentDownvotes + 1;
      }
      // If no previous vote
      else {
        newUpvotes = isUpvote ? currentUpvotes + 1 : currentUpvotes;
        newDownvotes = isUpvote ? currentDownvotes : currentDownvotes + 1;
      }

      // Update UI immediately
      dispatch({
        type: ACTIONS.UPDATE_ANSWER,
        payload: {
          postId,
          answerId: parseInt(id),
          answer: {
            ...currentAnswer,
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            userVote: newUserVote
          }
        }
      });

      // Send request to server
      const response = await api.post(`${API_URL}/api/forum/${type}/${id}/vote`, {
        isUpvote
      });

      if (!response.data?.success) {
        throw new Error('Vote failed');
      }

      // Update with server response
      const { data } = response.data;
      
      if (data.updatedItem) {
        dispatch({
          type: ACTIONS.UPDATE_ANSWER,
          payload: {
            postId,
            answerId: parseInt(id),
            answer: {
              ...data.updatedItem,
              upvotes: data.upvotes || newUpvotes,
              downvotes: data.downvotes || newDownvotes,
              userVote: data.userVote || newUserVote
            }
          }
        });
      }

      return true;
    } catch (error) {
      console.error('Vote error:', error);
      
      // Revert to original state on error
      const originalAnswer = state.questions
        .flatMap(q => q.answers)
        .find(a => a.id === parseInt(id));
      
      if (originalAnswer) {
        dispatch({
          type: ACTIONS.UPDATE_ANSWER,
          payload: {
            postId: state.questions.find(q => 
              q.answers.some(a => a.id === parseInt(id))
            )?.id,
            answerId: parseInt(id),
            answer: originalAnswer
          }
        });
      }

      throw error;
    }
  };

  // Answer related functions
  const addAnswer = async (questionId, content, images = []) => {
    try {
      const response = await api.post(`/api/forum/posts/${questionId}/answers`, {
        content,
        images
      });
      if (response.data?.success) {
        const updatedQuestion = response.data.data;
        dispatch({
          type: ACTIONS.REFRESH_QUESTION,
          payload: updatedQuestion
        });
        return updatedQuestion;
      }
      throw new Error(response.data?.error || 'Failed to add answer');
    } catch (error) {
      console.error('Error adding answer:', error);
      throw error;
    }
  };

  // Comment related functions
  const addComment = async (questionId, answerId, data) => {
    try {
      const endpoint = answerId 
        ? `/api/forum/posts/${questionId}/answers/${answerId}/comments`
        : `/api/forum/posts/${questionId}/comments`;

      const response = await api.post(endpoint, data);
      
      if (response.data?.success) {
        const updatedQuestion = response.data.data;
        dispatch({
          type: ACTIONS.REFRESH_QUESTION,
          payload: updatedQuestion
        });
        return response.data;
      }
      throw new Error(response.data?.error || 'Failed to add comment');
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  // Community related functions
  const fetchCommunities = async () => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const response = await api.get('/api/communities');
      const communities = response.data?.data || [];
      dispatch({ type: ACTIONS.SET_COMMUNITIES, payload: communities });
    } catch (error) {
      console.error('Error fetching communities:', error);
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
    }
  };

  const joinCommunity = async (communityId) => {
    try {
      const response = await api.post(`/api/communities/${communityId}/join`);
      await fetchCommunities();
      return response.data;
    } catch (error) {
      console.error('Error joining community:', error);
      throw error;
    }
  };

  const leaveCommunity = async (communityId) => {
    try {
      await api.post(`/api/communities/${communityId}/leave`);
      await fetchCommunities();
    } catch (error) {
      console.error('Error leaving community:', error);
      throw error;
    }
  };

  // Context value
  const value = useMemo(() => ({
    ...state,
    refreshQuestion,
    addQuestion,
    handleVote,
    addAnswer,
    addComment,
    fetchCommunities,
    joinCommunity,
    leaveCommunity
  }), [state]);

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
}

export default CommunityContext; 