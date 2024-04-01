import { useEffect } from "react";
import { Navigate, useOutlet, useLocation } from "react-router-dom";
import { isLoggedIn } from "../authentication/authManager";
import useAuth from "../authentication/useAuth";

const ProtectedLayout = () => {
  const { userLoaded, onLogOut } = useAuth();
  const outlet = useOutlet();
  const location = useLocation();

  useEffect(() => {
    console.log("islogin fired");
    const checkUserStatus = async () => {
      const userLogged = await isLoggedIn();
      console.log("userLogged", userLogged);
      console.log("userLoaded", userLoaded);
      if (!userLogged) {
        await onLogOut();
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
