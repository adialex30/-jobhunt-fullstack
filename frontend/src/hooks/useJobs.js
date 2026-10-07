import { useState, useEffect, useCallback } from 'react';
import { jobService } from '../services/jobService';

export function useJobs(initialOptions = {}) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    limit: initialOptions.limit || 6,
    hasNextPage: false,
    hasPrevPage: false
  });

  const [filters, setFilters] = useState({
    keyword: initialOptions.keyword || '',
    type: initialOptions.type || 'all',
    location: initialOptions.location || 'all',
    sortBy: initialOptions.sortBy || 'newest', 
    page: initialOptions.page || 1
  });

  const fetchJobs = useCallback(async (currentFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      const res = await jobService.getJobs({
        page: currentFilters.page,
        limit: pagination.limit,
        keyword: currentFilters.keyword,
        type: currentFilters.type,
        location: currentFilters.location
      });

      let items = res.data?.jobs || [];

      if (currentFilters.sortBy === 'applicants') {
        items = [...items].sort((a, b) => (b.applicants_count || 0) - (a.applicants_count || 0));
      } else {
        items = [...items].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }

      setJobs(items);
      setPagination({
        currentPage: res.pagination?.currentPage || res.data?.currentPage || currentFilters.page,
        totalPages: res.pagination?.totalPages || res.data?.totalPages || 1,
        totalJobs: res.pagination?.totalJobs !== undefined ? res.pagination.totalJobs : (res.data?.totalJobs || items.length),
        limit: res.pagination?.limit || pagination.limit,
        hasNextPage: res.pagination?.hasNextPage || false,
        hasPrevPage: res.pagination?.hasPrevPage || false
      });
    } catch (err) {
      console.error('Error in useJobs:', err);
      setError(err.message || 'Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchJobs(filters);
    }, 300); 

    return () => clearTimeout(handler);
  }, [filters, fetchJobs]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await jobService.getJobStats();
      if (res && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Error fetching job stats:', err);
    }
  }, []);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      ...(newFilters.page === undefined ? { page: 1 } : {})
    }));
  };

  const setPage = (pageNumber) => {
    setFilters((prev) => ({ ...prev, page: pageNumber }));
  };

  return {
    jobs,
    loading,
    error,
    stats,
    pagination,
    filters,
    updateFilters,
    setPage,
    refetch: () => fetchJobs(filters),
    fetchStats
  };
}

export default useJobs;
