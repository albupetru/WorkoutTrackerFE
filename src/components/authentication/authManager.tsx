import { jwtDecode } from 'jwt-decode';
import { CodeResponse } from '@react-oauth/google';
import { UserData } from '../../types/userData.type';
import { UserRole } from '../../types/UserRole.type';
import { apiClient } from '../../api/apiClient';

const CLAIM_NAME = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
const CLAIM_ROLE =
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

interface JwtPayload {
  email: string;
  oid: string;
  [CLAIM_NAME]: string;
  [CLAIM_ROLE]: string;
  exp: number;
}

/**
 * Checks if the sessions is still valid
 * @returns {boolean} Session validity status
 */
export const isLoggedIn = async () => {
  const requestToken = localStorage.getItem('requestToken');

  if (requestToken == null || requestToken.length === 0) {
    return false;
  }

  const apiToken = jwtDecode(requestToken) as JwtPayload;

  const { exp } = apiToken;
  const dateNow = new Date();

  if (exp < dateNow.getTime() / 1000) {
    return false;
  }

  return true;
};

export const setupUser = async (): Promise<UserData | null> => {
  const requestToken = localStorage.getItem('requestToken');

  if (requestToken !== null) {
    const apiToken = jwtDecode(requestToken) as JwtPayload;
    const email = apiToken.email;
    const userId = apiToken.oid;
    const name = apiToken[CLAIM_NAME];
    const role = (apiToken[CLAIM_ROLE] as UserRole) || null;

    return {
      loading: false,
      error: false,
      userId,
      requestToken,
      name,
      email,
      role,
      userImage: false,
      userLoaded: true,
    };
  }
  return null; // TODO: handle the null token case
};

export const logIn = (
  googleResponse: CodeResponse,
  successCallback: () => void,
) => {
  apiClient
    .post<string | { token: string }>('/login', { code: googleResponse.code })
    .then((data) => {
      const requestToken = typeof data === 'string' ? data : data.token;
      localStorage.setItem('requestToken', requestToken);
      successCallback();
    })
    .catch((error) => {
      // TODO: handle login errors more gracefully (e.g. show error message to user)
      console.error('Error:', error);
    });
};

export const logOut = async () => {
  const userLoggedIn = await isLoggedIn();
  // if a session is active, invalidate the API token
  if (userLoggedIn) {
    apiClient.post('/logout').catch(() => {});
  }
  localStorage.removeItem('requestToken');
};
