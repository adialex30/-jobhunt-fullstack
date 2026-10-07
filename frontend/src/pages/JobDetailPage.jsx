import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, DollarSign, Send, Bookmark, Share2, Edit2, Trash2, Users, CheckCircle2 } from 'lucide-react';
import { jobService } from '../services/jobService';
import { useAuth } from '../context/AuthContext';

export default function JobDetailPage({ onApply, onEditJob, savedJobIds = [], onToggleBookmark, showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn, isRecruiter, isJobSeeker } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await jobService.getJobById(id);
        if (isMounted) {
          if (res && res.data) {
            setJob(res.data);
          } else {
            setError('Job opening not found.');
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error in fetchJob:', err);
          setError('Job opening not found or server is unavailable.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchJob();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Competitive Salary';
    const fmt = (num) => {
      const n = Number(num);
      if (isNaN(n) || n === 0) return '0';
      if (n >= 1000000) return `Rp ${(n / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}M`;
      return `Rp ${n.toLocaleString('id-ID')}`;
    };
    if (min && max) return `${fmt(min)} – ${fmt(max)} / month`;
    if (min) return `From ${fmt(min)} / month`;
    return `Up to ${fmt(max)} / month`;
  };

  const isSaved = job ? savedJobIds.includes(String(job.id)) : false;

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-24 text-center font-mono text-xs text-[#78716c]">
        Loading job opening details...
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-20 text-center font-mono">
        <p className="font-heading text-xl font-bold text-[#ba1a1a] mb-4">
          {error || 'Job not found'}
        </p>
        <Link
          to="/opportunities?tab=jobs"
          className="fm-btn fm-btn-primary px-5 py-2 text-xs inline-flex items-center gap-2"
        >
          <ArrowLeft size={14} />
          <span>Back to Opportunities</span>
        </Link>
      </div>
    );
  }

  const handleDeleteJob = async () => {
    if (!window.confirm(`Permanently delete job "${job.title}"?`)) return;
    try {
      await jobService.deleteJob(job.id);
      if (showToast) showToast('Job successfully deleted.');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error deleting job:', err);
      if (showToast) showToast(err.message || 'Failed to delete job.');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-mono">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          to="/opportunities?tab=jobs"
          className="inline-flex items-center gap-2 text-xs text-[#78716c] hover:text-[#1c1917] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Opportunities</span>
        </Link>
        {isLoggedIn && isRecruiter && (user?.id === job.recruiter_id || !job.recruiter_id) && onEditJob && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => onEditJob(job)}
              className="fm-btn px-3 py-1.5 border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917] hover:border-[#1c1917] flex items-center gap-1.5 text-xs"
            >
              <Edit2 size={12} />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={handleDeleteJob}
              className="fm-btn px-3 py-1.5 border-red-300 bg-red-50 text-red-700 hover:bg-red-100 flex items-center gap-1.5 text-xs"
            >
              <Trash2 size={12} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      <article className="bg-[#F9F8F6] border border-[#D9CFC7] p-4 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 sm:pb-8 border-b border-[#D9CFC7]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-bold text-[#6b5c47] text-sm uppercase tracking-wider">
                {job.company}
              </span>
              <span className="bg-[#EFE9E3] border border-[#D9CFC7] px-2.5 py-0.5 uppercase text-[10px] font-bold text-[#1c1917]">
                {job.type}
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1c1917] tracking-tight leading-tight">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#78716c] pt-1">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-[#6b5c47] shrink-0" />
                <span>{job.location || 'Remote'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign size={14} className="text-[#6b5c47] shrink-0" />
                <span className="font-bold text-[#1c1917]">{formatSalary(job.salary_min, job.salary_max)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-[#6b5c47] shrink-0" />
                <span>{job.created_at ? new Date(job.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
            {isLoggedIn && isJobSeeker && (
              <button
                type="button"
                onClick={(e) => onToggleBookmark && onToggleBookmark(e, String(job.id))}
                className="fm-btn p-2.5 border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917] hover:border-[#1c1917] shrink-0"
                aria-label="Save job"
                title={isSaved ? 'Remove from saved' : 'Save job'}
              >
                <Bookmark size={16} className={isSaved ? 'fill-[#C9B59C] text-[#6b5c47]' : ''} />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  if (showToast) showToast('Job link copied to clipboard!');
                }
              }}
              className="fm-btn p-2.5 border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917] hover:border-[#1c1917] shrink-0"
              aria-label="Share"
            >
              <Share2 size={16} />
            </button>

            {(!isLoggedIn || isJobSeeker) && (
              <button
                type="button"
                onClick={() => onApply && onApply(job)}
                className="fm-btn fm-btn-primary px-5 sm:px-6 py-2.5 text-xs flex-1 lg:flex-initial flex items-center justify-center gap-2 shadow-md hover:translate-x-0.5 transition-transform"
              >
                <Send size={14} />
                <span>Apply Now</span>
              </button>
            )}

            {isLoggedIn && isRecruiter && (user?.id === job.recruiter_id || !job.recruiter_id) && (
              <Link
                to={`/jobs/${job.id}/applicants`}
                className="fm-btn fm-btn-primary px-5 sm:px-6 py-2.5 text-xs flex-1 lg:flex-initial flex items-center justify-center gap-2 shadow-md hover:translate-x-0.5 transition-transform"
              >
                <Users size={14} />
                <span>Review Applicants</span>
              </Link>
            )}
          </div>
        </div>

        <div className="py-8 space-y-8">
          <div>
            <h2 className="font-heading text-xl font-bold text-[#1c1917] tracking-tight mb-3">
              Job Description
            </h2>
            <div className="font-sans text-sm sm:text-base text-[#57534e] leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </div>

          {job.requirements && (
            <div>
              <h2 className="font-heading text-xl font-bold text-[#1c1917] tracking-tight mb-3">
                Requirements &amp; Qualifications
              </h2>
              <div className="font-sans text-sm sm:text-base text-[#57534e] leading-relaxed whitespace-pre-line bg-[#EFE9E3]/50 border border-[#D9CFC7] p-5">
                {job.requirements}
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-[#D9CFC7] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#78716c]">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#6b5c47]" />
              <span>
                Posted by <strong>{job.recruiter_name || 'Verified Recruiter'}</strong>
              </span>
            </div>
            <span>Status: Active Opening</span>
          </div>
        </div>
      </article>
    </div>
  );
}
