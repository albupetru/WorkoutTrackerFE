import { useEffect } from 'react';
import { Navigate, useOutlet, useLocation } from 'react-router-dom';
import { isLoggedIn } from '../authentication/authManager';
import useAuth from '../authentication/useAuth';

const ProtectedLayout = () => {
  const { userLoaded, loading, onLogOut } = useAuth();
  const outlet = useOutlet();
  const location = useLocation();

  useEffect(() => {
    const checkUserStatus = async () => {
      const userLogged = await isLoggedIn();
      if (!userLogged && userLoaded) {
        await onLogOut();
      }
    };

    checkUserStatus();
  }, [location, onLogOut, userLoaded]);

  // Wait for auth initialization to complete
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userLoaded) {
    return <Navigate to="/login" />;
  }

  return <div>{outlet}</div>;
};

export default ProtectedLayout;
