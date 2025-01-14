import React, { createContext, useContext, useReducer, useMemo } from 'react';
import { ACTIONS } from './actions/types';
import { communityReducer } from './reducers/communityReducer';
import { communityService } from './services/communityService';

const CommunityContext = createContext();

export function useCommunity() {
  return useContext(CommunityContext);
}

const initialState = {
  communities: [],
  isLoading: false,
  error: null,
  currentUser: null
};

export function CommunityProvider({ children }) {
  const [state, dispatch] = useReducer(communityReducer, initialState);

  const fetchCommunities = async () => {
    try {
      dispatch({ type: ACTIONS.FETCH_START });
      const data = await communityService.fetchCommunities();
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
    }
  };

  const joinCommunity = async (communityId) => {
    try {
      const data = await communityService.joinCommunity(communityId);
      await fetchCommunities(); // Refresh communities after joining
      return data;
    } catch (error) {
      console.error('Error joining community:', error);
      throw error;
    }
  };

  const leaveCommunity = async (communityId) => {
    try {
      const data = await communityService.leaveCommunity(communityId);
      await fetchCommunities(); // Refresh communities after leaving
      return data;
    } catch (error) {
      console.error('Error leaving community:', error);
      throw error;
    }
  };

  const value = useMemo(() => ({
    communities: state.communities,
    isLoading: state.isLoading,
    error: state.error,
    currentUser: state.currentUser,
    fetchCommunities,
    joinCommunity,
    leaveCommunity
  }), [state.communities, state.isLoading, state.error, state.currentUser]);

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
}

export default CommunityContext; 