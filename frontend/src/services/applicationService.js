const DEFAULT_API = 'http://127.0.0.1:5000/api';

const getBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    const cleanUrl = import.meta.env.VITE_API_URL.trim().replace(/\/+$/, '');
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }
  if (typeof window !== 'undefined') {
    return '/api';
  }
  return DEFAULT_API;
};

const getAuthToken = (token) => {
  if (token) return token;
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token') || localStorage.getItem('jwt');
  }
  return null;
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

export const applicationService = {
  async applyJob(jobId, { cover_letter = '' } = {}, token = null) {
    const authToken = getAuthToken(token);
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
    const res = await requestWithFallback(`/jobs/${jobId}/apply`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ cover_letter })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Failed to submit application (Status ${res.status})`);
    }
    return data;
  },

  async getMyApplications(token = null) {
    const authToken = getAuthToken(token);
    const headers = {};
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
    const res = await requestWithFallback('/applications/mine', {
      method: 'GET',
      headers
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Failed to load applications (Status ${res.status})`);
    }
    return data.data || [];
  },

  async getJobApplicants(jobId, token = null) {
    const authToken = getAuthToken(token);
    const headers = {};
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
    const res = await requestWithFallback(`/jobs/${jobId}/applicants`, {
      method: 'GET',
      headers
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Failed to load applicants (Status ${res.status})`);
    }
    return data.data || [];
  },

  async updateStatus(applicationId, status, token = null) {
    const authToken = getAuthToken(token);
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
    const res = await requestWithFallback(`/applications/${applicationId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Failed to update status (Status ${res.status})`);
    }
    return data;
  },

  async getRecruiterDashboard(token = null) {
    const authToken = getAuthToken(token);
    const headers = {};
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
    const res = await requestWithFallback('/applications/dashboard', {
      method: 'GET',
      headers
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Failed to load dashboard summary (Status ${res.status})`);
    }
    return data.data;
  }
};
