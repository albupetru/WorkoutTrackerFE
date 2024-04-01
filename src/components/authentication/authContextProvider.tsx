import { createContext, useReducer, useMemo } from "react";
import { setupUser, logOut } from "./authManager";
import initialState from "./initialState";
import reducer from "./reducer";
import { setUser, clearUser } from "./reducerActions";
import { UserData } from "../../types/userData.type";

export type AuthDataContextType = {
  onLogIn: () => Promise<void>;
  onLogOut: () => Promise<void>;
  onTokenRefresh: () => Promise<UserData | null>;
  userLoaded: boolean;
};

export const AuthDataContext = createContext<AuthDataContextType | null>(null);

type AuthDataProviderProps = {
  children: React.ReactNode;
};

const AuthDataProvider = (props: AuthDataProviderProps) => {
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

  return <AuthDataContext.Provider value={authState} {...props} />;
};

export default AuthDataProvider;
