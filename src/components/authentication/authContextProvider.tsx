import { createContext, useReducer, useMemo, useEffect } from "react";
import { setupUser, logOut, isLoggedIn } from "./authManager";
import initialState from "./initialState";
import reducer from "./reducer";
import { setUser, clearUser } from "./reducerActions";
import { UserData } from "../../types/userData.type";

export type AuthDataContextType = {
  onLogIn: () => Promise<void>;
  onLogOut: () => Promise<void>;
  onTokenRefresh: () => Promise<UserData | null>;
  userLoaded: boolean;
  loading: boolean;
};

export const AuthDataContext = createContext<AuthDataContextType | null>(null);

type AuthDataProviderProps = {
  children: React.ReactNode;
};

const AuthDataProvider = (props: AuthDataProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Restore user session on mount if valid token exists
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const loggedIn = await isLoggedIn();
        if (loggedIn) {
          const userdata = await setupUser();
          if (userdata) {
            dispatch(setUser({ ...userdata, loading: false }));
          } else {
            dispatch(
              setUser({ ...initialState, loading: false, userLoaded: false }),
            );
          }
        } else {
          // Clear invalid/expired token
          localStorage.removeItem("requestToken");
          localStorage.removeItem("accessToken");
          dispatch(
            setUser({ ...initialState, loading: false, userLoaded: false }),
          );
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Clear potentially corrupted tokens
        localStorage.removeItem("requestToken");
        localStorage.removeItem("accessToken");
        dispatch(
          setUser({ ...initialState, loading: false, userLoaded: false }),
        );
      }
    };

    initializeAuth();
  }, []);

  const onLogIn = async () => {
    const userdata = await setupUser();
    if (userdata) {
      dispatch(setUser({ ...userdata, loading: false }));
    }
  };

  const onTokenRefresh = async () => {
    const userdata = await setupUser();
    if (userdata) {
      dispatch(setUser({ ...userdata, loading: false }));
    }
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
