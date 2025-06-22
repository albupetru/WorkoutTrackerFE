import { RequestHeaders } from "../types/requestHeaders.type";

let defaultHeaders: RequestHeaders = {
  Authorization: `Bearer ${localStorage.getItem("requestToken")}`,
  "Content-Type": "application/json",
};

// TODO: error handling, options type

const authenticatedFetch = (
  url: string,
  options: any = {},
  customHeaders: RequestHeaders = {},
) => {
  const headers = { ...defaultHeaders, ...customHeaders };

  return fetch(url, { ...options, headers });
};

const setDefaultRequestHeader = (key: string, newValue: string) => {
  defaultHeaders[key] = newValue;
};

const getDefaultRequestHeader = (key: string) => defaultHeaders[key] || null;

const removeDefaultRequestHeader = (key: string) => {
  delete defaultHeaders[key];
};

export {
  authenticatedFetch,
  setDefaultRequestHeader,
  getDefaultRequestHeader,
  removeDefaultRequestHeader,
};
