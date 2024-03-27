import { useContext } from 'react';
import { AuthenticationDataContext } from './authenticationContextProvider';

const useAuth = () => useContext(AuthenticationDataContext);

export default useAuth;
