import { useContext } from 'react';
import { AuthDataContext, AuthDataContextType } from './authContextProvider';

const useAuth = () => useContext(AuthDataContext) as AuthDataContextType;

export default useAuth;
