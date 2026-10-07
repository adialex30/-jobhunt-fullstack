import { useState, useCallback } from 'react';
import { applicationService } from '../services/applicationService';

export function useApplications() {
  const [applications, setApplications] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await applicationService.getMyApplications();
      setApplications(data || []);
      return data;
    } catch (err) {
      console.error('Error fetching my applications:', err);
      setError(err.message || 'Failed to load applications.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const applyJob = async (jobId, { cover_letter = '' } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await applicationService.applyJob(jobId, { cover_letter });
      return result;
    } catch (err) {
      console.error('Error submitting application:', err);
      setError(err.message || 'Failed to submit application.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchJobApplicants = useCallback(async (jobId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await applicationService.getJobApplicants(jobId);
      setApplicants(data || []);
      return data;
    } catch (err) {
      console.error('Error fetching job applicants:', err);
      setError(err.message || 'Failed to load job applicants.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = async (applicationId, status) => {
    setError(null);
    try {
      const result = await applicationService.updateStatus(applicationId, status);
      setApplicants((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status } : app))
      );
      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status } : app))
      );
      return result;
    } catch (err) {
      console.error('Error updating application status:', err);
      setError(err.message || 'Failed to update application status.');
      throw err;
    }
  };

  const fetchRecruiterDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await applicationService.getRecruiterDashboard();
      setDashboardData(data);
      return data;
    } catch (err) {
      console.error('Error fetching recruiter dashboard:', err);
      setError(err.message || 'Failed to load recruiter dashboard.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    applications,
    applicants,
    dashboardData,
    loading,
    error,
    fetchMyApplications,
    applyJob,
    fetchJobApplicants,
    updateStatus,
    fetchRecruiterDashboard
  };
}

export default useApplications;
