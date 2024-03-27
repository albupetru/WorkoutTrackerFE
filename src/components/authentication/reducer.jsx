import intialState from './initialState';
import { SET_USER, CLEAR_USER } from './reducerActionTypes';

const reducer = (state = intialState, action = {}) => {
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
