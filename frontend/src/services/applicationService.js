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

// Helper to retrieve auth token
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
  // POST /api/jobs/:id/apply - Lamar pekerjaan (Job Seeker)
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
      throw new Error(data.message || `Gagal melamar pekerjaan (Status ${res.status})`);
    }
    return data;
  },

  // GET /api/applications/mine - Riwayat lamaran user login (Job Seeker)
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
      throw new Error(data.message || `Gagal mengambil riwayat lamaran (Status ${res.status})`);
    }
    return data.data || [];
  },

  // GET /api/jobs/:id/applicants - Daftar pelamar untuk job tertentu (Recruiter)
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
      throw new Error(data.message || `Gagal mengambil daftar pelamar (Status ${res.status})`);
    }
    return data.data || [];
  },

  // PUT /api/applications/:id - Update status lamaran (Recruiter)
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
      throw new Error(data.message || `Gagal memperbarui status lamaran (Status ${res.status})`);
    }
    return data;
  },

  // GET /api/applications/dashboard - Ringkasan statistik recruiter
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
      throw new Error(data.message || `Gagal mengambil ringkasan dashboard (Status ${res.status})`);
    }
    return data.data;
  }
};
