
const DEFAULT_API = 'http://127.0.0.1:5000/api';

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    const cleanUrl = import.meta.env.VITE_API_URL.trim().replace(/\/+$/, '');
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }
  if (typeof window !== 'undefined') {
    return '/api';
  }
  return DEFAULT_API;
};

const DEMO_RECRUITER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZWNydWl0ZXJzQGV4YW1wbGUuY29tIiwicm9sZSI6InJlY3J1aXRlciIsIm5hbWUiOiJyZWNydWl0ZXJzIiwiaWF0IjoxNzkxMDI2MzM5LCJleHAiOjE3OTM2MTgzMzl9.evqSRBcPbK9WHzjWgEqo8iXdoBZ-4s-cjeAq9tJGopc';

const getAuthToken = (token) => {
  if (token) return token;
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('token') || localStorage.getItem('jwt');
    if (stored) return stored;
  }
  return DEMO_RECRUITER_TOKEN;
};

async function requestWithFallback(endpoint, options = {}) {
  const baseUrl = getBaseUrl();
  let url = `${baseUrl}${endpoint}`;
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

export const jobService = {
  async getJobs({ page = 1, limit = 6, keyword = '', type = '', location = '' } = {}) {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append('page', page);
    if (limit) queryParams.append('limit', limit);
    if (keyword && keyword.trim()) queryParams.append('keyword', keyword.trim());
    if (type && type !== 'all') queryParams.append('type', type);
    if (location && location !== 'all') queryParams.append('location', location);
    const endpoint = `/jobs?${queryParams.toString()}`;
    const response = await requestWithFallback(endpoint);
    if (!response.ok) {
      throw new Error(`Failed to load jobs: HTTP ${response.status}`);
    }
    return response.json();
  },

  async getJobById(id) {
    let queryId = id;
    if (typeof id === 'string' && id.toUpperCase().startsWith('AURA-10')) {
      const extracted = parseInt(id.replace(/^AURA-10*/i, ''), 10);
      if (!isNaN(extracted)) queryId = extracted;
    }
    const endpoint = `/jobs/${queryId}`;
    const response = await requestWithFallback(endpoint);
    if (!response.ok) {
      throw new Error('Job opening not found or server error occurred.');
    }
    return response.json();
  },

  async getMyJobs(token) {
    const authToken = getAuthToken(token);
    const endpoint = `/jobs/mine`;
    const response = await requestWithFallback(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
      }
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to load your posted jobs.');
    }
    return response.json();
  },

  async createJob(jobData, token) {
    const authToken = getAuthToken(token);
    const endpoint = `/jobs`;
    const response = await requestWithFallback(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
      },
      body: JSON.stringify(jobData)
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to post job.');
    }
    return result;
  },

  async updateJob(id, updateData, token) {
    let queryId = id;
    if (typeof id === 'string' && id.toUpperCase().startsWith('AURA-10')) {
      const extracted = parseInt(id.replace(/^AURA-10*/i, ''), 10);
      if (!isNaN(extracted)) queryId = extracted;
    }
    const authToken = getAuthToken(token);
    const endpoint = `/jobs/${queryId}`;
    const response = await requestWithFallback(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
      },
      body: JSON.stringify(updateData)
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to update job.');
    }
    return result;
  },

  async deleteJob(id, token) {
    let queryId = id;
    if (typeof id === 'string' && id.toUpperCase().startsWith('AURA-10')) {
      const extracted = parseInt(id.replace(/^AURA-10*/i, ''), 10);
      if (!isNaN(extracted)) queryId = extracted;
    }
    const authToken = getAuthToken(token);
    const endpoint = `/jobs/${queryId}`;
    const response = await requestWithFallback(endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
      }
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete job.');
    }
    return result;
  },

  async getJobStats() {
    const endpoint = `/jobs/stats`;
    const response = await requestWithFallback(endpoint);
    if (!response.ok) {
      throw new Error(`Failed to load job stats.`);
    }
    return response.json();
  }
};
