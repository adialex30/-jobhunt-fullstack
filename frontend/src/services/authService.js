const DEFAULT_API = 'http://127.0.0.1:5000/api';

const getBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    return '/api';
  }
  return DEFAULT_API;
};

async function requestWithFallback(endpoint, options = {}) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  try {
    const res = await fetch(url, options);
    if (!res.ok && baseUrl === '/api') {
      const fallbackUrl = `${DEFAULT_API}${endpoint}`;
      return await fetch(fallbackUrl, options);
    }
    return res;
  } catch (networkError) {
    if (baseUrl === '/api') {
      const fallbackUrl = `${DEFAULT_API}${endpoint}`;
      return await fetch(fallbackUrl, options);
    }
    throw networkError;
  }
}

export const authService = {
  // POST /api/auth/register (name, email, password, role)
  async register({ name, email, password, role }) {
    const response = await requestWithFallback('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registrasi gagal.');
    }
    return data;
  },

  // POST /api/auth/login (email, password)
  async login({ email, password }) {
    const response = await requestWithFallback('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Email atau password salah.');
    }

    if (data.data?.token) {
      localStorage.setItem('token', data.data.token);
      if (data.data.user) {
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }
    }

    return data;
  },

  // GET /api/auth/me (JWT token)
  async getMe() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const response = await requestWithFallback('/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
      }

      const data = await response.json();
      const user = data.data?.user || data.data;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      return user;
    } catch {
      return null;
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user from localStorage
  getCurrentUser() {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('token');
  }
};
