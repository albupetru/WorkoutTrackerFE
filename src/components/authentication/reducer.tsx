import intialState from './initialState';
import { SET_USER, CLEAR_USER } from './reducerActionTypes';
import { AuthReducerAction } from '../../types/authReducerAction.type';
import { UserData } from '../../types/userData.type';


const reducer = (state: UserData = intialState, action: AuthReducerAction): UserData => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        ...action.payload,
        userLoaded: true,
      };
    case CLEAR_USER:
      return {
        ...intialState,
        userLoaded: false,
      };
    default:
      throw new Error();
  }
};

export default reducer;
