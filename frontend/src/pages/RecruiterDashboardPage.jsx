import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Briefcase, Eye, Edit2, Trash2, ArrowUpRight, AlertCircle, RefreshCw } from 'lucide-react';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';

export default function RecruiterDashboardPage({ showToast }) {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [jobsRes, dashRes] = await Promise.all([
        jobService.getMyJobs().catch((err) => {
          console.warn('Could not fetch recruiter jobs:', err);
          return { data: [] };
        }),
        applicationService.getRecruiterDashboard().catch((err) => {
          console.warn('Could not fetch dashboard summary:', err);
          return null;
        })
      ]);

      const myJobs = jobsRes?.data || [];
      setJobs(myJobs);
      setDashboardData(dashRes);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Gagal memuat data dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [jobsRes, dashRes] = await Promise.all([
          jobService.getMyJobs().catch((err) => {
            console.warn('Could not fetch recruiter jobs:', err);
            return { data: [] };
          }),
          applicationService.getRecruiterDashboard().catch((err) => {
            console.warn('Could not fetch dashboard summary:', err);
            return null;
          })
        ]);

        if (isMounted) {
          const myJobs = jobsRes?.data || [];
          setJobs(myJobs);
          setDashboardData(dashRes);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading dashboard data:', err);
          setError(err.message || 'Gagal memuat data dashboard.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDeleteJob = async (jobId, jobTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${jobTitle}"? All related applications will also be deleted.`)) {
      return;
    }

    setIsDeleting(jobId);
    try {
      await jobService.deleteJob(jobId);
      if (showToast) showToast(`Job "${jobTitle}" was deleted successfully.`);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      setDashboardData((prev) => {
        if (!prev) return null;
        const currentCount = prev.total_jobs_posted ?? prev.total_jobs ?? 1;
        const newCount = Math.max(0, currentCount - 1);
        return {
          ...prev,
          total_jobs_posted: newCount,
          total_jobs: newCount
        };
      });
    } catch (err) {
      console.error('Error deleting job:', err);
      if (showToast) showToast(err.message || 'Failed to delete job.');
    } finally {
      setIsDeleting(null);
    }
  };

  const totalJobs = dashboardData?.total_jobs_posted ?? dashboardData?.total_jobs ?? jobs.length;
  const totalApplicants = dashboardData?.total_applicants ?? jobs.reduce((acc, j) => acc + (j.applicants_count || 0), 0);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-mono">

      <div className="mb-8 border-b border-[#D9CFC7] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-[#78716c] uppercase tracking-widest block mb-1">
            RECRUITER CONSOLE
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1c1917] tracking-tight">
            Recruiter Dashboard
          </h1>
          <p className="text-xs text-[#57534e] mt-1">
            Welcome back, <span className="font-bold text-[#1c1917]">{user?.name}</span>. Manage your job postings and review applicants.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            title="Reload Data"
            className="p-2 border border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917] hover:border-[#1c1917] transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link
            to="/jobs/create"
            className="px-4 py-2 bg-[#1c1917] text-[#F9F8F6] text-xs font-bold uppercase tracking-wider hover:bg-[#C9B59C] hover:text-[#1c1917] transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus size={14} />
            <span>Post a New Job</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#F9F8F6] border border-[#D9CFC7] p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-[#78716c]">Total Jobs Posted</span>
            <div className="p-2 bg-[#EFE9E3] text-[#1c1917]">
              <Briefcase size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-heading font-bold text-[#1c1917]">{totalJobs}</div>
            <p className="text-[11px] text-[#57534e] mt-0.5">Active published jobs</p>
          </div>
        </div>

        <div className="bg-[#F9F8F6] border border-[#D9CFC7] p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-[#78716c]">Total Applicants</span>
            <div className="p-2 bg-[#EFE9E3] text-[#1c1917]">
              <Users size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-heading font-bold text-[#1c1917]">{totalApplicants}</div>
            <p className="text-[11px] text-[#57534e] mt-0.5">Candidates who applied</p>
          </div>
        </div>

        <div className="bg-[#F9F8F6] border border-[#D9CFC7] p-5 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-[#78716c]">Quick Actions</span>
            <div className="p-2 bg-[#EFE9E3] text-[#1c1917]">
              <ArrowUpRight size={16} />
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-1.5">
            <Link
              to="/opportunities?tab=candidates"
              className="text-xs font-bold text-[#1c1917] hover:underline underline-offset-4"
            >
              Candidate Bench &rarr;
            </Link>
            <Link
              to="/profile"
              className="text-xs font-bold text-[#1c1917] hover:underline underline-offset-4"
            >
              Recruiter Profile &rarr;
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
          <button onClick={loadData} className="underline font-bold">
            Retry
          </button>
        </div>
      )}

      <div className="bg-[#F9F8F6] border border-[#D9CFC7]">
        <div className="px-5 py-4 border-b border-[#D9CFC7] flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-[#1c1917]">
            Your Job Openings
          </h2>
          <span className="text-xs text-[#78716c] font-bold">
            {jobs.length} Jobs
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#78716c] space-y-2">
            <div className="w-5 h-5 border-2 border-[#1c1917] border-t-transparent animate-spin mx-auto"></div>
            <p>Loading job list...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <p className="text-xs text-[#57534e]">
              You have not posted any job openings yet.
            </p>
            <Link
              to="/jobs/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1c1917] text-[#F9F8F6] text-xs font-bold uppercase tracking-wider hover:bg-[#C9B59C] hover:text-[#1c1917] transition-all"
            >
              <Plus size={14} />
              <span>Post Your First Job</span>
            </Link>
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EFE9E3] border-b border-[#D9CFC7] text-[#78716c] uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="px-5 py-3">Role &amp; Company</th>
                    <th className="px-4 py-3">Type / Location</th>
                    <th className="px-4 py-3">Date Posted</th>
                    <th className="px-4 py-3 text-center">Applicants</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9CFC7]">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-[#F2ECE6] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-[#1c1917] text-sm">{job.title}</div>
                        <div className="text-[11px] text-[#6b5c47]">{job.company}</div>
                      </td>
                      <td className="px-4 py-3.5 text-[#57534e]">
                        <span className="inline-block bg-[#EFE9E3] border border-[#D9CFC7] px-2 py-0.5 text-[10px] font-bold text-[#1c1917] uppercase mr-2">
                          {job.type}
                        </span>
                        <span>{job.location || 'Remote'}</span>
                      </td>
                      <td className="px-4 py-3.5 text-[#78716c]">
                        {job.created_at
                          ? new Date(job.created_at).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })
                          : '-'}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <Link
                          to={`/jobs/${job.id}/applicants`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EFE9E3] border border-[#D9CFC7] hover:border-[#1c1917] font-bold text-[#1c1917] transition-all"
                          title="View Applicants"
                        >
                          <Users size={12} />
                          <span>{job.applicants_count ?? 0} Applicants</span>
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="p-1.5 border border-[#D9CFC7] bg-[#F9F8F6] text-[#1c1917] hover:border-[#1c1917] inline-block"
                          title="View Public Opening"
                        >
                          <Eye size={12} />
                        </Link>
                        <Link
                          to={`/jobs/${job.id}/edit`}
                          className="p-1.5 border border-[#D9CFC7] bg-[#F9F8F6] text-[#1c1917] hover:border-[#1c1917] inline-block"
                          title="Edit Job"
                        >
                          <Edit2 size={12} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteJob(job.id, job.title)}
                          disabled={isDeleting === job.id}
                          className="p-1.5 border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 inline-block disabled:opacity-50"
                          title="Delete Job"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (< md) */}
            <div className="block md:hidden divide-y divide-[#D9CFC7]">
              {jobs.map((job) => (
                <div key={job.id} className="p-4 space-y-3 bg-[#F9F8F6]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-heading font-bold text-base text-[#1c1917] leading-snug">
                        {job.title}
                      </h3>
                      <span className="text-xs text-[#6b5c47] font-bold block mt-0.5">
                        {job.company}
                      </span>
                    </div>
                    <span className="bg-[#EFE9E3] border border-[#D9CFC7] px-2 py-0.5 text-[9px] font-bold uppercase shrink-0">
                      {job.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#78716c]">
                    <span> {job.location || 'Remote'}</span>
                    <span>•</span>
                    <span>
                      {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#D9CFC7]/60 flex items-center justify-between gap-2">
                    <Link
                      to={`/jobs/${job.id}/applicants`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#EFE9E3] border border-[#D9CFC7] text-xs font-bold text-[#1c1917]"
                    >
                      <Users size={12} />
                      <span>{job.applicants_count ?? 0} Applicants</span>
                    </Link>

                    <div className="flex items-center gap-1.5">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="p-2 border border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917]"
                        title="View Opening"
                      >
                        <Eye size={13} />
                      </Link>
                      <Link
                        to={`/jobs/${job.id}/edit`}
                        className="p-2 border border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917]"
                        title="Edit Job"
                      >
                        <Edit2 size={13} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteJob(job.id, job.title)}
                        disabled={isDeleting === job.id}
                        className="p-2 border border-red-200 bg-red-50 text-red-700 disabled:opacity-50"
                        title="Delete Job"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
