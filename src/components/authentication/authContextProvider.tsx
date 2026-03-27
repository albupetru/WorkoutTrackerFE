import { createContext, useReducer, useMemo, useEffect } from 'react';
import { setupUser, logOut, isLoggedIn } from './authManager';
import initialState from './initialState';
import reducer from './reducer';
import { setUser, clearUser } from './reducerActions';
import { UserData } from '../../types/userData.type';
import { UserRole } from '../../types/UserRole.type';

export type AuthDataContextType = {
  onLogIn: () => Promise<void>;
  onLogOut: () => Promise<void>;
  onTokenRefresh: () => Promise<UserData | null>;
  userLoaded: boolean;
  loading: boolean;
  name: string | null;

  // Role checks
  role: UserRole | null;
  isAdmin: boolean;
  isModerator: boolean;
  isUser: boolean;
  isTrial: boolean;
  isAtLeast: (minimumRole: UserRole) => boolean;
};

export const AuthDataContext = createContext<AuthDataContextType | null>(null);

type AuthenticationContextProviderProps = {
  children: React.ReactNode;
};

const AuthenticationContextProvider = (
  props: AuthenticationContextProviderProps,
) => {
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
          localStorage.removeItem('requestToken');
          dispatch(
            setUser({ ...initialState, loading: false, userLoaded: false }),
          );
        }
      } catch (error) {
        // Clear potentially corrupted tokens
        localStorage.removeItem('requestToken');
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

  // Role checks
  const role = state.role;
  const isAdmin = role === 'Admin';
  const isModerator = role === 'ContentModerator';
  const isUser = role === 'User';
  const isTrial = role === 'Trial';

  const isAtLeast = (minimumRole: UserRole): boolean => {
    if (!role) {
      return false;
    }

    const roleHierarchy: Record<UserRole, number> = {
      Admin: 4,
      ContentModerator: 3,
      User: 2,
      Trial: 1,
    };

    return roleHierarchy[role] >= roleHierarchy[minimumRole];
  };

  const authState = useMemo(
    () => ({
      ...state,
      onLogIn,
      onLogOut,
      onTokenRefresh,
      role,
      isAdmin,
      isModerator,
      isUser,
      isTrial,
      isAtLeast,
    }),
    [state, role, isAdmin, isModerator, isUser, isTrial],
  );

  return <AuthDataContext.Provider value={authState} {...props} />;
};

export default AuthenticationContextProvider;
