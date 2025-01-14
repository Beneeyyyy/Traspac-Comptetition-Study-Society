import React, { createContext, useContext, useReducer, useMemo, useEffect } from 'react';
import { ACTIONS } from './actions/types';
import { forumReducer } from './reducers/forumReducer';
import { forumService } from './services/forumService';

const ForumContext = createContext();

export function useForum() {
  return useContext(ForumContext);
}

export function ForumProvider({ children }) {
  const [state, dispatch] = useReducer(forumReducer, {
    questions: [],
    isLoading: true,
    error: null
  });

  // Fetch questions when component mounts
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      dispatch({ type: ACTIONS.FETCH_START });
      const questions = await forumService.fetchQuestions();
      console.log('Fetched questions:', questions); // Debug log
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

  const addComment = async (questionId, answerId, content) => {
    try {
      const newComment = await forumService.addComment(questionId, answerId, content);
      if (newComment) {
        dispatch({ 
          type: ACTIONS.ADD_COMMENT, 
          payload: {
            ...newComment,
            questionId,
            answerId
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
        }
      }
      
      return updatedItem;
    } catch (error) {
      console.error('Error handling vote:', error);
      throw error;
    }
  };

  const value = useMemo(() => ({
    questions: state.questions || [],
    isLoading: state.isLoading,
    error: state.error,
    fetchQuestions,
    refreshQuestion,
    addQuestion,
    addAnswer,
    addComment,
    handleVote
  }), [state.questions, state.isLoading, state.error]);

  return (
    <ForumContext.Provider value={value}>
      {children}
    </ForumContext.Provider>
  );
}

export default ForumContext; 