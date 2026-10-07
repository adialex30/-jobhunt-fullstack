
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

const parseJobId = (id) => {
  if (typeof id === 'string' && id.toUpperCase().startsWith('AURA-')) {
    const extracted = parseInt(id.replace(/^AURA-0*/i, '').replace(/^AURA-/i, ''), 10);
    if (!isNaN(extracted)) return extracted;
  }
  return id;
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
    return await fetch(url, options);
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
    const queryId = parseJobId(id);
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
    const queryId = parseJobId(id);
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
    const queryId = parseJobId(id);
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
