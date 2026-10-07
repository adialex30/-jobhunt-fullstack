import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Briefcase,
  Users,
  Bookmark,
  ArrowRight,
  MapPin,
  Calendar,
  Mail,
  PlusCircle,
  X,
  Send,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { jobService } from '../services/jobService';
import { api } from '../services/api';

export default function OpportunitiesPage({
  onApply,
  onOpenPostModal,
  savedJobIds = [],
  onToggleBookmark,
  showToast
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoggedIn, isRecruiter, isJobSeeker } = useAuth();

  // Tab state: only recruiters and admins can access candidate bench
  const defaultTab = isRecruiter ? 'candidates' : 'jobs';
  const initialTab = searchParams.get('tab') === 'candidates' && (isRecruiter || user?.role === 'admin')
    ? 'candidates'
    : (isRecruiter ? 'candidates' : 'jobs');

  const [activeTab, setActiveTab] = useState(initialTab);

  // Database jobs state
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  // Database candidates (job seekers) state
  const [candidates, setCandidates] = useState([]);
  const [candidatesLoading, setCandidatesLoading] = useState(false);

  // Shortlisted candidates IDs (stored in localStorage)
  const [shortlistedCandidateIds, setShortlistedCandidateIds] = useState(() => {
    try {
      const stored = localStorage.getItem('shortlisted_candidate_ids');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [selectedCandidateForInterview, setSelectedCandidateForInterview] = useState(null);
  const [interviewMessage, setInterviewMessage] = useState('');
  const [targetJobRole, setTargetJobRole] = useState('');

  // Fetch jobs from database
  useEffect(() => {
    let isMounted = true;
    const fetchJobs = async () => {
      try {
        setJobsLoading(true);
        const res = await jobService.getJobs({ limit: 50 });
        if (isMounted && res?.data?.jobs) {
          setJobs(res.data.jobs);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        if (isMounted) setJobsLoading(false);
      }
    };
    fetchJobs();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch real job seekers from database if recruiter or admin
  useEffect(() => {
    let isMounted = true;
    if (isLoggedIn && (isRecruiter || user?.role === 'admin')) {
      const fetchCandidates = async () => {
        try {
          setCandidatesLoading(true);
          const res = await api.getUsers({ role: 'job_seeker' });
          if (isMounted && res?.data) {
            setCandidates(res.data);
          }
        } catch (err) {
          console.error('Error fetching candidates:', err);
        } finally {
          if (isMounted) setCandidatesLoading(false);
        }
      };
      fetchCandidates();
    }
    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, isRecruiter, user]);

  // Sync tab with role and searchParams
  useEffect(() => {
    if (!isLoggedIn) {
      setActiveTab('jobs');
      return;
    }
    const tabParam = searchParams.get('tab');
    if (isRecruiter) {
      setActiveTab(tabParam === 'jobs' ? 'jobs' : 'candidates');
    } else if (isJobSeeker) {
      setActiveTab('jobs');
    } else if (user?.role === 'admin') {
      if (tabParam === 'candidates' || tabParam === 'jobs') {
        setActiveTab(tabParam);
      }
    }
  }, [isLoggedIn, isRecruiter, isJobSeeker, user, searchParams]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', newTab);
    setSearchParams(newParams);
  };

  // Job Filters
  const [jobSearch, setJobSearch] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [selectedJobLocation, setSelectedJobLocation] = useState('All');

  // Extract unique locations from real database jobs
  const jobLocations = useMemo(() => {
    const locSet = new Set();
    jobs.forEach((j) => {
      if (j.location) locSet.add(j.location.trim());
    });
    return Array.from(locSet);
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const q = jobSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        job.title?.toLowerCase().includes(q) ||
        job.company?.toLowerCase().includes(q) ||
        job.description?.toLowerCase().includes(q);

      const matchType =
        selectedJobType === 'All' ||
        job.type?.toLowerCase() === selectedJobType.toLowerCase();

      const matchLocation =
        selectedJobLocation === 'All' ||
        job.location?.toLowerCase().includes(selectedJobLocation.toLowerCase());

      return matchSearch && matchType && matchLocation;
    });
  }, [jobs, jobSearch, selectedJobType, selectedJobLocation]);

  // Candidate Filters
  const [candidateSearch, setCandidateSearch] = useState('');

  const filteredCandidates = useMemo(() => {
    return candidates.filter((cand) => {
      const q = candidateSearch.toLowerCase().trim();
      if (!q) return true;
      return (
        cand.name?.toLowerCase().includes(q) ||
        cand.email?.toLowerCase().includes(q)
      );
    });
  }, [candidates, candidateSearch]);

  const handleToggleShortlist = (candId) => {
    setShortlistedCandidateIds((prev) => {
      const exists = prev.includes(candId);
      let updated;
      if (exists) {
        updated = prev.filter((id) => id !== candId);
        if (showToast) showToast('Candidate removed from shortlist.');
      } else {
        updated = [...prev, candId];
        if (showToast) showToast('Candidate added to shortlist.');
      }
      try {
        localStorage.setItem('shortlisted_candidate_ids', JSON.stringify(updated));
      } catch (e) { }
      return updated;
    });
  };

  const handleOpenInterviewModal = (cand) => {
    setSelectedCandidateForInterview(cand);
    setTargetJobRole('Software Engineer');
    setInterviewMessage(
      `Hello ${cand.name}, we reviewed your profile on the platform and would like to invite you for an interview.`
    );
  };

  const handleSendInterviewInvite = () => {
    if (showToast) {
      showToast(`Interview invitation sent to ${selectedCandidateForInterview.name}.`);
    }
    setSelectedCandidateForInterview(null);
  };

  const formatSalaryText = (min, max) => {
    if (!min && !max) return 'Competitive Salary';
    const fmt = (num) => `Rp ${(num / 1000000).toFixed(0)}M`;
    if (min && max) return `${fmt(min)} – ${fmt(max)} / mo`;
    if (min) return `From ${fmt(min)} / mo`;
    return `Up to ${fmt(max)} / mo`;
  };

  return (
    <div className="w-full bg-[#faf9f7] text-[#1c1917] min-h-screen py-8 sm:py-12 font-mono">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header Section */}
        <div className="border-b border-[#D9CFC7] pb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] text-[#8C7A6B] uppercase tracking-widest font-bold">
                Career Network
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#1c1917] mt-1">
                {activeTab === 'jobs' ? 'Job Opportunities' : 'Candidate Bench'}
              </h1>
              <p className="font-serif italic text-sm sm:text-base text-[#57534e] mt-1 max-w-xl">
                {activeTab === 'jobs'
                  ? 'Explore available positions and apply directly.'
                  : 'Browse registered job seekers and connect with potential hires.'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Content: Jobs */}
        {activeTab === 'jobs' ? (
          <div className="space-y-6">

            {/* Filter Bar */}
            <div className="bg-[#EFE9E3] border border-[#D9CFC7] p-4 sm:p-5 space-y-3 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-6 relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]" />
                  <input
                    type="text"
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    placeholder="Search by title, company, or keyword..."
                    className="w-full pl-9 pr-8 py-2.5 bg-[#F9F8F6] border border-[#D9CFC7] text-xs text-[#1c1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#1c1917]"
                  />
                  {jobSearch && (
                    <button
                      onClick={() => setJobSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1c1917]"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                <div className="md:col-span-3">
                  <select
                    value={selectedJobType}
                    onChange={(e) => setSelectedJobType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#F9F8F6] border border-[#D9CFC7] text-xs text-[#1c1917] focus:outline-none focus:border-[#1c1917]"
                  >
                    <option value="All">All Job Types</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="remote">Remote</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <select
                    value={selectedJobLocation}
                    onChange={(e) => setSelectedJobLocation(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#F9F8F6] border border-[#D9CFC7] text-xs text-[#1c1917] focus:outline-none focus:border-[#1c1917]"
                  >
                    <option value="All">All Locations</option>
                    {jobLocations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#D9CFC7]/60 text-xs">
                <span className="text-[#78716C] text-[11px]">
                  Showing <strong className="text-[#1c1917]">{filteredJobs.length}</strong> openings
                </span>
                {(jobSearch || selectedJobType !== 'All' || selectedJobLocation !== 'All') && (
                  <button
                    type="button"
                    onClick={() => {
                      setJobSearch('');
                      setSelectedJobType('All');
                      setSelectedJobLocation('All');
                    }}
                    className="text-[11px] text-[#57534e] hover:text-[#1c1917] underline"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* Jobs Grid & Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* Job Listings Column */}
              <div className="lg:col-span-8 space-y-4">
                {jobsLoading ? (
                  <div className="bg-[#F9F8F6] border border-[#D9CFC7] p-12 text-center text-xs text-[#78716C]">
                    Loading job opportunities...
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="bg-[#EFE9E3] border border-[#D9CFC7] p-10 text-center space-y-3">
                    <Briefcase size={28} className="mx-auto text-[#78716C]" />
                    <p className="font-bold text-[#1c1917]">No opportunities match your filter.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setJobSearch('');
                        setSelectedJobType('All');
                        setSelectedJobLocation('All');
                      }}
                      className="fm-btn text-xs mt-2"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  filteredJobs.map((job) => {
                    const isBookmarked = savedJobIds.includes(String(job.id));
                    return (
                      <article
                        key={job.id}
                        className="bg-[#F9F8F6] border border-[#D9CFC7] p-5 sm:p-6 hover:border-[#1c1917] transition-all space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-[#1c1917] text-[#F9F8F6] flex items-center justify-center font-bold text-xs">
                              {job.company?.charAt(0)?.toUpperCase() || 'C'}
                            </span>
                            <span className="font-bold text-[#1c1917]">{job.company}</span>
                            <span className="text-[#D9CFC7]">·</span>
                            <span className="text-[#78716C] flex items-center gap-1">
                              <MapPin size={12} />
                              {job.location || 'Remote'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-[#EFE9E3] border border-[#D9CFC7] text-[10px] font-bold uppercase">
                              {job.type || 'Full-time'}
                            </span>
                            {(!isLoggedIn || isJobSeeker) && (
                              <button
                                type="button"
                                onClick={(e) => onToggleBookmark && onToggleBookmark(e, job.id)}
                                className="p-1.5 border border-[#D9CFC7] bg-[#EFE9E3] hover:border-[#1c1917] text-[#1c1917] transition-colors"
                                title={isBookmarked ? 'Remove Bookmark' : 'Save Opportunity'}
                              >
                                <Bookmark
                                  size={13}
                                  className={isBookmarked ? 'fill-[#C9B59C] text-[#8C7A6B]' : 'text-[#78716C]'}
                                />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                          <Link
                            to={`/jobs/${job.id}`}
                            className="font-heading text-lg sm:text-xl font-bold text-[#1c1917] hover:text-[#8C7A6B] transition-colors"
                          >
                            {job.title}
                          </Link>
                          <div className="font-mono text-xs font-bold text-[#1c1917] shrink-0">
                            {formatSalaryText(job.salary_min, job.salary_max)}
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed font-sans line-clamp-2">
                          {job.description}
                        </p>

                        <div className="pt-3 border-t border-[#D9CFC7]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <span className="text-[11px] text-[#78716C]">
                            {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recently posted'}
                          </span>
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              to={`/jobs/${job.id}`}
                              className="fm-btn text-xs py-1.5 px-3 bg-[#EFE9E3] border-[#D9CFC7] hover:border-[#1c1917]"
                            >
                              <span>View Opening</span>
                            </Link>

                            {(!isLoggedIn || isJobSeeker) && (
                              <button
                                type="button"
                                onClick={() => onApply && onApply(job)}
                                className="fm-btn fm-btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5"
                              >
                                <span>Quick Apply</span>
                                <ArrowRight size={13} />
                              </button>
                            )}

                            {isRecruiter && (user?.id === job.recruiter_id || !job.recruiter_id) && (
                              <Link
                                to={`/jobs/${job.id}/edit`}
                                className="fm-btn text-xs py-1.5 px-3 border-[#D9CFC7] bg-[#F9F8F6] hover:border-[#1c1917]"
                              >
                                <span>Edit</span>
                              </Link>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>

              {/* Sidebar Info */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-[#EFE9E3] border border-[#D9CFC7] p-5 space-y-3">
                  <span className="text-xs uppercase tracking-wider font-bold text-[#1c1917] block">
                    Overview
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#D9CFC7]">
                      <span className="text-[#57534e]">Total Openings</span>
                      <strong className="text-[#1c1917]">{jobs.length}</strong>
                    </div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#D9CFC7]">
                      <span className="text-[#57534e]">Saved Jobs</span>
                      <strong className="text-[#1c1917]">{savedJobIds.length}</strong>
                    </div>
                  </div>
                  {isRecruiter && onOpenPostModal && (
                    <button
                      type="button"
                      onClick={onOpenPostModal}
                      className="w-full mt-3 fm-btn fm-btn-primary py-2 text-xs flex items-center justify-center gap-2"
                    >
                      <PlusCircle size={13} />
                      <span>Post a New Job</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* Tab Content: Candidates (Recruiters & Admins) */
          <div className="space-y-6">

            {/* Filter Bar */}
            <div className="bg-[#EFE9E3] border border-[#D9CFC7] p-4 sm:p-5 space-y-3 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-8 relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]" />
                  <input
                    type="text"
                    value={candidateSearch}
                    onChange={(e) => setCandidateSearch(e.target.value)}
                    placeholder="Search candidate by name or email..."
                    className="w-full pl-9 pr-8 py-2.5 bg-[#F9F8F6] border border-[#D9CFC7] text-xs text-[#1c1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#1c1917]"
                  />
                  {candidateSearch && (
                    <button
                      onClick={() => setCandidateSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1c1917]"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
                <div className="md:col-span-4 text-right">
                  <span className="text-[#78716C] text-[11px]">
                    Showing <strong className="text-[#1c1917]">{filteredCandidates.length}</strong> registered candidates
                  </span>
                </div>
              </div>
            </div>

            {/* Candidates Grid & Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* Candidate Cards Column */}
              <div className="lg:col-span-8 space-y-4">
                {candidatesLoading ? (
                  <div className="bg-[#F9F8F6] border border-[#D9CFC7] p-12 text-center text-xs text-[#78716C]">
                    Loading registered candidates...
                  </div>
                ) : filteredCandidates.length === 0 ? (
                  <div className="bg-[#EFE9E3] border border-[#D9CFC7] p-10 text-center space-y-3">
                    <Users size={28} className="mx-auto text-[#78716C]" />
                    <p className="font-bold text-[#1c1917]">No candidates found.</p>
                  </div>
                ) : (
                  filteredCandidates.map((cand) => {
                    const isShortlisted = shortlistedCandidateIds.includes(cand.id);
                    const initials = cand.name?.slice(0, 2).toUpperCase() || 'JS';
                    const joinDate = cand.created_at
                      ? new Date(cand.created_at).toLocaleDateString()
                      : 'Active';

                    return (
                      <article
                        key={cand.id}
                        className="bg-[#F9F8F6] border border-[#D9CFC7] p-5 sm:p-6 hover:border-[#1c1917] transition-all space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-12 h-12 shrink-0 border border-[#D9CFC7] bg-[#EFE9E3] flex items-center justify-center font-bold text-sm text-[#1c1917]">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-heading text-lg font-bold text-[#1c1917] truncate">
                                  {cand.name}
                                </h3>
                                <span className="px-1.5 py-0.5 bg-[#EFE9E3] border border-[#D9CFC7] text-[10px] font-bold uppercase text-[#57534e]">
                                  Job Seeker
                                </span>
                              </div>
                              <p className="text-xs text-[#78716C] font-mono mt-0.5 truncate">
                                {cand.email}
                              </p>
                              <p className="text-[11px] text-[#78716C] font-mono mt-0.5">
                                Registered: {joinDate}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                            <button
                              type="button"
                              onClick={() => handleToggleShortlist(cand.id)}
                              className={`fm-btn text-xs py-1.5 px-3 border transition-all ${isShortlisted
                                ? 'bg-[#1c1917] text-[#F9F8F6] border-[#1c1917] font-bold'
                                : 'bg-[#EFE9E3] text-[#1c1917] border-[#D9CFC7] hover:border-[#1c1917]'
                                }`}
                            >
                              <Bookmark size={12} className={isShortlisted ? 'fill-[#C9B59C]' : ''} />
                              <span>{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenInterviewModal(cand)}
                              className="fm-btn fm-btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5"
                            >
                              <Mail size={12} />
                              <span>Contact</span>
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>

              {/* Sidebar Info */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-[#EFE9E3] border border-[#D9CFC7] p-5 space-y-3">
                  <span className="text-xs uppercase tracking-wider font-bold text-[#1c1917] block">
                    Candidate Bench Pipeline
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-3 bg-[#F9F8F6] border border-[#D9CFC7]">
                      <span className="text-2xl font-bold font-serif text-[#1c1917]">
                        {candidates.length}
                      </span>
                      <span className="block text-[10px] text-[#78716C] uppercase mt-0.5">Total Talent</span>
                    </div>
                    <div className="p-3 bg-[#F9F8F6] border border-[#D9CFC7]">
                      <span className="text-2xl font-bold font-serif text-[#2E5C38]">
                        {shortlistedCandidateIds.length}
                      </span>
                      <span className="block text-[10px] text-[#78716C] uppercase mt-0.5">Shortlisted</span>
                    </div>
                  </div>
                  {onOpenPostModal && (
                    <button
                      type="button"
                      onClick={onOpenPostModal}
                      className="w-full mt-2 fm-btn fm-btn-primary py-2 text-xs flex items-center justify-center gap-2"
                    >
                      <PlusCircle size={13} />
                      <span>Post a New Job</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Contact / Interview Modal */}
      {selectedCandidateForInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#F9F8F6] border border-[#1c1917] max-w-lg w-full p-6 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9CFC7]">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#1c1917]">
                  Send Invitation
                </h3>
                <span className="text-xs text-[#78716C]">
                  To: {selectedCandidateForInterview.name} ({selectedCandidateForInterview.email})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCandidateForInterview(null)}
                className="p-1 hover:bg-[#EFE9E3] text-[#78716C] hover:text-[#1c1917]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#78716C] uppercase tracking-wider mb-1">
                  Target Position:
                </label>
                <input
                  type="text"
                  value={targetJobRole}
                  onChange={(e) => setTargetJobRole(e.target.value)}
                  className="w-full p-2.5 bg-[#EFE9E3] border border-[#D9CFC7] text-[#1c1917] focus:outline-none focus:border-[#1c1917]"
                />
              </div>
              <div>
                <label className="block text-[#78716C] uppercase tracking-wider mb-1">
                  Invitation Message:
                </label>
                <textarea
                  rows={4}
                  value={interviewMessage}
                  onChange={(e) => setInterviewMessage(e.target.value)}
                  className="w-full p-2.5 bg-[#EFE9E3] border border-[#D9CFC7] text-[#1c1917] focus:outline-none focus:border-[#1c1917] font-sans text-xs leading-relaxed"
                />
              </div>
            </div>
            <div className="pt-3 border-t border-[#D9CFC7] flex items-center justify-end gap-3 text-xs">
              <button
                type="button"
                onClick={() => setSelectedCandidateForInterview(null)}
                className="fm-btn py-2 px-4 bg-[#EFE9E3] border-[#D9CFC7] hover:border-[#1c1917]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendInterviewInvite}
                className="fm-btn fm-btn-primary py-2 px-5 flex items-center gap-1.5"
              >
                <Send size={13} />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
