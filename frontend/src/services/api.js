const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return 'http://localhost:5000/api';
  const cleanUrl = envUrl.trim().replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

export const API_BASE_URL = getApiBaseUrl();
const AUTH_TOKEN_STORAGE_KEY = 'token';


export const getToken = () => localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
export const setToken = (tokenValue) => localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, tokenValue);
export const removeToken = () => localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);

const executeApiRequest = async (endpointPath, requestConfig = {}) => {
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...(requestConfig.headers || {})
  };
  const storedAuthToken = getToken();
  if (storedAuthToken && !requestHeaders['Authorization']) {
    requestHeaders['Authorization'] = `Bearer ${storedAuthToken}`;
  }
  try {
    const httpResponse = await fetch(`${API_BASE_URL}${endpointPath}`, {
      ...requestConfig,
      headers: requestHeaders
    });
    const responsePayload = await httpResponse.json().catch(() => ({}));
    if (!httpResponse.ok) {
      const err = new Error(responsePayload.message || 'Server request failed.');
      err.status = httpResponse.status;
      throw err;
    }
    return responsePayload;
  } catch (caughtError) {
    if (caughtError.message && caughtError.message.includes('Failed to fetch')) {
      throw new Error(`Unable to connect to the backend server (${API_BASE_URL}). Please ensure the backend is running and CORS is configured.`, {
        cause: caughtError
      });
    }
    throw caughtError;
  }
};

export const api = {
  async login(email, password) {
    const authenticationResponse = await executeApiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    const receivedToken = authenticationResponse.data?.token;
    if (receivedToken) {
      setToken(receivedToken);
    }
    return authenticationResponse;
  },
  async register(name, email, password, role) {
    const registrationResponse = await executeApiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    });
    return registrationResponse;
  },
  async getUsers(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.role) queryParams.append('role', params.role);
    const qs = queryParams.toString();
    const endpoint = `/users${qs ? `?${qs}` : ''}`;
    return executeApiRequest(endpoint, { method: 'GET' });
  },
  async getMe() {
    const currentToken = getToken();
    if (!currentToken) return null;
    try {
      const userProfileResponse = await executeApiRequest('/auth/me', {
        method: 'GET'
      });
      return userProfileResponse.data;
    } catch (profileFetchError) {
      if (profileFetchError.status === 401 || profileFetchError.status === 403) {
        removeToken();
      }
      return null;
    }
  },
  logout() {
    removeToken();
  }
};
