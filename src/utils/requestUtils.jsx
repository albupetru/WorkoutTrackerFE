let defaultHeaders = {
  Authorization: `Bearer ${localStorage.getItem('requestToken')}`,
  'Content-Type': 'application/json',
};

const customFetch = (url, options = {}, customHeaders = {}) => {
  const headers = { ...defaultHeaders, ...customHeaders };

  return fetch(url, { ...options, headers });
};

const setDefaultRequestHeader = (key, newValue) => {
  defaultHeaders[key] = newValue;
};

const getDefaultRequestHeader = (key) => defaultHeaders[key] || null;

const removeDefaultRequestHeader = (key) => {
  delete defaultHeaders[key];
};

export {
  customFetch,
  setDefaultRequestHeader,
  getDefaultRequestHeader,
  removeDefaultRequestHeader,
};
