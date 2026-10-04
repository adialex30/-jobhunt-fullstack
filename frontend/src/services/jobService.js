const DEFAULT_API = 'http://127.0.0.1:5000/api';

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    return '/api';
  }
  return DEFAULT_API;
};

const DEMO_RECRUITER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJyZWNydWl0ZXJzQGV4YW1wbGUuY29tIiwicm9sZSI6InJlY3J1aXRlciIsIm5hbWUiOiJyZWNydWl0ZXJzIiwiaWF0IjoxNzkxMDI2MzM5LCJleHAiOjE3OTM2MTgzMzl9.evqSRBcPbK9WHzjWgEqo8iXdoBZ-4s-cjeAq9tJGopc';

// Helper to retrieve auth token from localStorage if not explicitly passed
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
    // If proxy failed (e.g. 404 or 502), try direct IPv4 backend
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
  // GET /api/jobs (Semua job aktif: filter, search, pagination)
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
      throw new Error(`Gagal mengambil data lowongan: HTTP ${response.status}`);
    }

    return response.json();
  },

  // GET /api/jobs/:id (Detail satu job)
  async getJobById(id) {
    const endpoint = `/jobs/${id}`;
    const response = await requestWithFallback(endpoint);

    if (!response.ok) {
      throw new Error(`Lowongan tidak ditemukan atau server error`);
    }

    return response.json();
  },

  // GET /api/jobs/mine (Daftar job milik recruiter yang login)
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
      throw new Error(errData.message || 'Gagal memuat lowongan Anda.');
    }

    return response.json();
  },

  // POST /api/jobs (Posting job baru - Recruiter)
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
      throw new Error(result.message || 'Gagal memposting lowongan.');
    }

    return result;
  },

  // PUT /api/jobs/:id (Update job - hanya milik sendiri)
  async updateJob(id, updateData, token) {
    const authToken = getAuthToken(token);
    const endpoint = `/jobs/${id}`;
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
      throw new Error(result.message || 'Gagal memperbarui lowongan.');
    }

    return result;
  },

  // DELETE /api/jobs/:id (Hapus job - hanya milik sendiri)
  async deleteJob(id, token) {
    const authToken = getAuthToken(token);
    const endpoint = `/jobs/${id}`;
    const response = await requestWithFallback(endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
      }
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Gagal menghapus lowongan.');
    }

    return result;
  },

  // GET /api/jobs/stats (Ringkasan statistik)
  async getJobStats() {
    const endpoint = `/jobs/stats`;
    const response = await requestWithFallback(endpoint);

    if (!response.ok) {
      throw new Error(`Gagal mengambil statistik jobs`);
    }

    return response.json();
  }
};
