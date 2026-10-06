const API_BASE_URL = 'http://localhost:5000/api';
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
    const responsePayload = await httpResponse.json();
    if (!httpResponse.ok) {
      throw new Error(responsePayload.message || 'Server request failed.');
    }
    return responsePayload;
  } catch (caughtError) {
    if (caughtError.message && caughtError.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to the backend server (http://localhost:5000). Please ensure the backend is running.');
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
      removeToken();
      return null;
    }
  },
  logout() {
    removeToken();
  }
};
