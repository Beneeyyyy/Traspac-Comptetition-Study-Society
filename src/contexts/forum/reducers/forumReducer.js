import { ACTIONS } from '../actions/types';

export function forumReducer(state, action) {
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
    case ACTIONS.UPDATE_QUESTION:
      return {
        ...state,
        questions: state.questions.map(q => 
          q.id === action.payload.id 
            ? { ...q, ...action.payload }
            : q
        )
      };
    case ACTIONS.UPDATE_ANSWER:
      return {
        ...state,
        questions: state.questions.map(q => ({
          ...q,
          answers: q.answers?.map(a => 
            a.id === action.payload.id
              ? { ...a, ...action.payload }
              : a
          ) || []
        }))
      };
    case ACTIONS.ADD_QUESTION:
      return {
        ...state,
        questions: [action.payload, ...state.questions]
      };
    case ACTIONS.ADD_ANSWER:
      return {
        ...state,
        questions: state.questions.map(q =>
          q.id === action.payload.questionId
            ? { ...q, answers: [...(q.answers || []), action.payload] }
            : q
        )
      };
    case ACTIONS.ADD_COMMENT:
      return {
        ...state,
        questions: state.questions.map(q => {
          if (action.payload.questionId === q.id) {
            return {
              ...q,
              comments: [...(q.comments || []), action.payload]
            };
          }
          return {
            ...q,
            answers: q.answers?.map(a =>
              a.id === action.payload.answerId
                ? { ...a, comments: [...(a.comments || []), action.payload] }
                : a
            ) || []
          };
        })
      };
    default:
      return state;
  }
} 