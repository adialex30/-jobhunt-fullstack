import { useState, useCallback } from 'react';
import { applicationService } from '../services/applicationService';

export function useApplications() {
  const [applications, setApplications] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lamar pekerjaan (Job Seeker)
  const applyJob = async (jobId, cover_letter) => {
    setLoading(true);
    setError(null);
    try {
      const res = await applicationService.applyJob(jobId, { cover_letter });
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Ambil riwayat lamaran user login (Job Seeker)
  const fetchMyApplications = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const list = await applicationService.getMyApplications();
      setApplications(list);
      return list;
    } catch (err) {
      if (!silent) setError(err.message);
      return [];
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Ambil daftar pelamar untuk job tertentu (Recruiter)
  const fetchJobApplicants = useCallback(async (jobId, { silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const list = await applicationService.getJobApplicants(jobId);
      setApplicants(list);
      return list;
    } catch (err) {
      if (!silent) setError(err.message);
      return [];
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Update status lamaran (Recruiter)
  const updateStatus = async (applicationId, status) => {
    try {
      const res = await applicationService.updateStatus(applicationId, status);
      // Update local state
      setApplicants((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status } : app))
      );
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Ambil ringkasan statistik recruiter (Recruiter)
  const fetchDashboardStats = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const stats = await applicationService.getRecruiterDashboard();
      setDashboardStats(stats);
      return stats;
    } catch (err) {
      if (!silent) setError(err.message);
      return null;
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  return {
    applications,
    applicants,
    dashboardStats,
    loading,
    error,
    applyJob,
    fetchMyApplications,
    fetchJobApplicants,
    updateStatus,
    fetchDashboardStats
  };
}
