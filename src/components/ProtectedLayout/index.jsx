import { useEffect } from 'react';
import { Navigate, useOutlet, useLocation } from 'react-router-dom';
import { isLoggedIn, logOut } from '../authentication/authenticationManager';
import useAuth from '../authentication/useAuth';

const ProtectedLayout = () => {
  const { userLoaded, clearUser } = useAuth();
  const outlet = useOutlet();

  const location = useLocation();
  useEffect(() => {
    console.log('islogin fired');
    const checkUserStatus = async () => {
      const userLogged = await isLoggedIn();
      console.log('userLogged', userLogged);
      if (!userLogged) {
        await logOut();
        clearUser();
        // navigate('/login');
      }
    };

    checkUserStatus();
  }, [location]);

  if (!userLoaded) {
    return <Navigate to="/login" />;
  }

  return <div>{outlet}</div>;
};

export default ProtectedLayout;
