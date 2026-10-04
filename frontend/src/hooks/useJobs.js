import { useState, useCallback } from 'react';
import { jobService } from '../services/jobService';

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [currentJob, setCurrentJob] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    limit: 6
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const res = await jobService.getJobs(params);
      if (res && res.data) {
        const jobsList = Array.isArray(res.data.jobs) ? res.data.jobs : (Array.isArray(res.data) ? res.data : []);
        setJobs(jobsList);
        setPagination({
          currentPage: res.data.currentPage || res.pagination?.currentPage || 1,
          totalPages: res.data.totalPages || res.pagination?.totalPages || 1,
          totalJobs: res.data.totalJobs || res.pagination?.totalJobs || jobsList.length,
          limit: res.data.limit || res.pagination?.limit || 6
        });
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat daftar lowongan pekerjaan.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchJobById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const res = await jobService.getJobById(id);
      const jobData = res.data?.job || res.data;
      setCurrentJob(jobData);
      return jobData;
    } catch (err) {
      setError(err.message || 'Gagal memuat detail lowongan.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyJobs = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      const res = await jobService.getMyJobs();
      const list = Array.isArray(res.data) ? res.data : [];
      setMyJobs(list);
      return list;
    } catch (err) {
      if (!silent) setError(err.message || 'Gagal memuat lowongan milik Anda.');
      return [];
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  const createJob = async (jobData) => {
    return await jobService.createJob(jobData);
  };

  const updateJob = async (id, updateData) => {
    return await jobService.updateJob(id, updateData);
  };

  const deleteJob = async (id) => {
    const res = await jobService.deleteJob(id);
    setMyJobs((prev) => prev.filter((j) => j.id !== id));
    return res;
  };

  return {
    jobs,
    myJobs,
    currentJob,
    pagination,
    loading,
    error,
    fetchJobs,
    fetchJobById,
    fetchMyJobs,
    createJob,
    updateJob,
    deleteJob
  };
}
