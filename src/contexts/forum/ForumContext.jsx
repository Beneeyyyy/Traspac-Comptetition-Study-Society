import React, { createContext, useContext, useReducer, useMemo, useEffect } from 'react';
import { ACTIONS } from './actions/types';
import { forumReducer } from './reducers/forumReducer';
import { forumService } from './services/forumService';

const ForumContext = createContext();

export function useForum() {
  return useContext(ForumContext);
}

export function ForumProvider({ children }) {
  // Load initial vote status from localStorage
  const initialVoteStatus = JSON.parse(localStorage.getItem('forumVoteStatus') || '{}');

  const [state, dispatch] = useReducer(forumReducer, {
    questions: [],
    isLoading: true,
    error: null,
    voteStatus: initialVoteStatus
  });

  // Save vote status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('forumVoteStatus', JSON.stringify(state.voteStatus));
  }, [state.voteStatus]);

  // Fetch questions when component mounts
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      dispatch({ type: ACTIONS.FETCH_START });
      const questions = await forumService.fetchQuestions();
      console.log('Fetched questions:', questions);
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: questions });
    } catch (error) {
      console.error('Error fetching questions:', error);
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
    }
  };

  const refreshQuestion = async (id) => {
    try {
      const data = await forumService.refreshQuestion(id);
      if (data) {
        dispatch({ type: ACTIONS.REFRESH_QUESTION, payload: data });
      }
      return data;
    } catch (error) {
      console.error('Error refreshing question:', error);
      throw error;
    }
  };

  const addQuestion = async (data) => {
    try {
      const newQuestion = await forumService.addQuestion(data);
      if (newQuestion) {
        dispatch({ type: ACTIONS.ADD_QUESTION, payload: newQuestion });
      }
      return newQuestion;
    } catch (error) {
      console.error('Error adding question:', error);
      throw error;
    }
  };

  const addAnswer = async (questionId, data) => {
    try {
      const newAnswer = await forumService.addAnswer(questionId, data);
      if (newAnswer) {
        dispatch({ type: ACTIONS.ADD_ANSWER, payload: { ...newAnswer, questionId } });
      }
      return newAnswer;
    } catch (error) {
      console.error('Error adding answer:', error);
      throw error;
    }
  };

  const addComment = async (questionId, answerId, content, parentId = null) => {
    try {
      const newComment = await forumService.addComment(questionId, answerId, content, parentId);
      if (newComment) {
        dispatch({ 
          type: ACTIONS.ADD_COMMENT, 
          payload: {
            ...newComment,
            questionId,
            answerId,
            parentId
          }
        });
      }
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  const handleVote = async (type, id, isUpvote) => {
    try {
      // Update local vote status immediately
      const newStatus = isUpvote ? 'upvote' : 'downvote';
      
      dispatch({
        type: ACTIONS.SET_VOTE_STATUS,
        payload: {
          type,
          id,
          status: newStatus
        }
      });

      const updatedItem = await forumService.handleVote(type, id, isUpvote);
      
      if (updatedItem) {
        if (type === 'post') {
          dispatch({ 
            type: ACTIONS.UPDATE_QUESTION, 
            payload: updatedItem
          });
        } else if (type === 'answer') {
          dispatch({ 
            type: ACTIONS.UPDATE_ANSWER, 
            payload: updatedItem
          });
        } else if (type === 'comment') {
          dispatch({
            type: ACTIONS.UPDATE_COMMENT,
            payload: updatedItem
          });
        }
      }
      
      return updatedItem;
    } catch (error) {
      // Revert vote status on error
      dispatch({
        type: ACTIONS.SET_VOTE_STATUS,
        payload: {
          type,
          id,
          status: null
        }
      });
      console.error('Error handling vote:', error);
      throw error;
    }
  };

  const value = useMemo(() => ({
    questions: state.questions || [],
    isLoading: state.isLoading,
    error: state.error,
    voteStatus: state.voteStatus,
    fetchQuestions,
    refreshQuestion,
    addQuestion,
    addAnswer,
    addComment,
    handleVote
  }), [state.questions, state.isLoading, state.error, state.voteStatus]);

  return (
    <ForumContext.Provider value={value}>
      {children}
    </ForumContext.Provider>
  );
}

export default ForumContext; 