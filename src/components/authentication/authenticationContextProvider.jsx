import { createContext, useReducer, useMemo } from 'react';
import { setupUser, logOut } from './authenticationManager';
import initialState from './initialState';
import reducer from './reducer';
import { setUser, clearUser } from './reducerActions';

export const AuthenticationDataContext = createContext({});

const AuthenticationDataProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onLogIn = async () => {
    const userdata = await setupUser();
    dispatch(setUser(userdata));
  };

  const onTokenRefresh = async () => {
    const userdata = await setupUser();
    dispatch(setUser(userdata));
    return userdata;
  };

  const onLogOut = async () => {
    await logOut();
    dispatch(clearUser());
  };

  const authState = useMemo(
    () => ({
      ...state,
      onLogIn,
      onLogOut,
      onTokenRefresh,
    }),
    [state],
  );

  return <AuthenticationDataContext.Provider value={authState} {...props} />;
};

export default AuthenticationDataProvider;
