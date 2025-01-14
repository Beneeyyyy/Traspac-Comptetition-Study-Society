import { ACTIONS } from '../actions/types';

export function communityReducer(state, action) {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, isLoading: true, error: null };
    case ACTIONS.FETCH_SUCCESS:
      return { ...state, isLoading: false, communities: action.payload };
    case ACTIONS.FETCH_ERROR:
      return { ...state, isLoading: false, error: action.payload };
    case ACTIONS.SET_USER:
      return { ...state, currentUser: action.payload };
    case ACTIONS.SET_COMMUNITIES:
      return { ...state, communities: action.payload };
    default:
      return state;
  }
} 