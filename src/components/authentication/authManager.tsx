import { jwtDecode } from "jwt-decode";
import {
  getDefaultRequestHeader,
  setDefaultRequestHeader,
  removeDefaultRequestHeader,
  authenticatedFetch,
} from "../../utils/requestUtils";
import { CodeResponse } from "@react-oauth/google";
import { UserData } from "../../types/userData.type";

interface JwtPayload {
  email: string;
  oid: string;
  name: string;
  exp: number;
}

/**
 * Checks if the sessions is still valid
 * @returns {boolean} Session validity status
 */
export const isLoggedIn = async () => {
  const requestToken = localStorage.getItem("requestToken");

  if (requestToken == null || requestToken.length === 0) {
    return false;
  }

  const apiToken = jwtDecode(decodeURIComponent(requestToken)) as JwtPayload;

  const { exp } = apiToken;
  const dateNow = new Date();

  if (exp < dateNow.getTime() / 1000) {
    return false;
  }

  if (`Bearer ${requestToken}` !== getDefaultRequestHeader("Authorization")) {
    setDefaultRequestHeader("Authorization", `Bearer ${requestToken}`);
  }

  return true;
};

export const setupUser = async (): Promise<UserData | null> => {
  const requestToken = localStorage.getItem("requestToken");

  setDefaultRequestHeader("Authorization", `Bearer ${requestToken}`);

  const accessToken = localStorage.getItem("accessToken");

  if (requestToken !== null) {
    const apiToken = jwtDecode(decodeURIComponent(requestToken)) as JwtPayload;

    const email = apiToken.email;
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
  }
  return null; // TODO: handle the null token case
};

export const logIn = (
  googleResponse: CodeResponse,
  successCallback: () => void,
) => {
  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: googleResponse.code }),
  })
    .then((response) => response.json())
    .then((requestToken) => {
      localStorage.setItem("requestToken", requestToken);
      setDefaultRequestHeader("Authorization", `Bearer ${requestToken}`);
      requestToken;
      successCallback();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

export const logOut = async () => {
  const userLoggedIn = await isLoggedIn();
  // if a session is active, invalidate the Compass API token
  if (userLoggedIn) {
    authenticatedFetch("/api/logout", {
      method: "POST",
    });
  }
  removeDefaultRequestHeader("Authorization");
  localStorage.removeItem("requestToken");
};
