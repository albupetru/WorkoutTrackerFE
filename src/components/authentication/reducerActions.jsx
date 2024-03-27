import * as actionTypes from './reducerActionTypes';

export const setUser = (payload) => ({
  payload,
  type: actionTypes.SET_USER,
});

export const clearUser = () => ({
  type: actionTypes.CLEAR_USER,
});
