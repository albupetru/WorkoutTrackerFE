import Button from '../Button';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { logIn, isLoggedIn } from '../authentication/authManager';
import useAuth from '../authentication/useAuth';
import './style.scss';

const LoginPage = () => {
  const navigate = useNavigate();
  const { onLogIn } = useAuth();

  const onGoogleLoginSuccess = async () => {
    await onLogIn();
    navigate('/');
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (googleResponse) => logIn(googleResponse, onGoogleLoginSuccess),
    onError: () => {
      console.error('Google login failed');
    },
    flow: 'auth-code',
  });

  const handleLogin = async () => {
    const userLoggedIn = await isLoggedIn();
    if (userLoggedIn) {
      await onLogIn();
      navigate('/');
    } else {
      handleGoogleLogin();
    }
  };

  return (
    <>
      <div>
        <h1>Workout Tracker</h1>
        <div className="login-fields-container">
          <Button onClick={handleLogin}>Login</Button>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
