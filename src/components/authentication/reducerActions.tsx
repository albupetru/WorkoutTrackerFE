import { AuthReducerAction } from '../../types/authReducerAction.type';
import { UserData } from '../../types/userData.type';
import * as actionTypes from './reducerActionTypes';

export const setUser = (payload: UserData | null): AuthReducerAction => ({
  payload,
  type: actionTypes.SET_USER,
});

export const clearUser = (): AuthReducerAction => ({
  payload: null,
  type: actionTypes.CLEAR_USER,
});
