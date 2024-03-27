import { jwtDecode } from 'jwt-decode';
import {
  getDefaultRequestHeader,
  setDefaultRequestHeader,
  removeDefaultRequestHeader,
  customFetch,
} from '../../utils/requestUtils';

/**
 * Checks if the sessions is still valid
 * @returns {boolean} Session validity status
 */
export const isLoggedIn = async () => {
  const requestToken = localStorage.getItem('requestToken');

  if (requestToken == null || requestToken.length === 0) {
    return false;
  }

  const apiToken = jwtDecode(decodeURIComponent(requestToken));

  const { exp } = apiToken;
  const dateNow = new Date();

  if (exp < dateNow.getTime() / 1000) {
    return false;
  }

  if (`Bearer ${requestToken}` !== getDefaultRequestHeader('Authorization')) {
    setDefaultRequestHeader('Authorization', `Bearer ${requestToken}`);
  }

  return true;
};

export const setupUser = async () => {
  const requestToken = localStorage.getItem('requestToken');

  setDefaultRequestHeader('Authorization', `Bearer ${requestToken}`);

  const accessToken = localStorage.getItem('accessToken');

  const apiToken = jwtDecode(decodeURIComponent(requestToken));

  const email = apiToken.preferred_username;
  const userId = apiToken.oid;
  const name = apiToken.name;

  return {
    loading: false,
    error: false,
    userId,
    requestToken,
    accessToken,
    name,
    email,
    userImage: false,
    userLoaded: true,
  };
};

export const logIn = (googleResponse, successCallback) => {
  fetch('https://localhost:7164/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code: googleResponse.code }),
  })
    .then((response) => response.json())
    .then((requestToken) => {
      localStorage.setItem('requestToken', requestToken);
      setDefaultRequestHeader('Authorization', `Bearer ${requestToken}`);
      requestToken;
      successCallback();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

export const logOut = async () => {
  const userLoggedIn = await isLoggedIn();
  // if a session is active, invalidate the Compass API token
  if (userLoggedIn) {
    customFetch('/login/Logout', {
      method: 'POST',
    });
  }
  removeDefaultRequestHeader('Authorization');
  localStorage.removeItem('requestToken');
};
