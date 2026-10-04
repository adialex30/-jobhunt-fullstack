import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Briefcase,
  Users,
  CheckCircle2,
  Bookmark,
  Sparkles,
  Filter,
  ArrowRight,
  MapPin,
  Calendar,
  Download,
  Mail,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Code,
  Terminal,
  PlusCircle,
  X,
  Send,
  SlidersHorizontal,
  Clock,
  TrendingUp,
  Award
} from 'lucide-react';
import { AURA_JOBS, AURA_CATEGORIES, AURA_LOCATIONS } from '../data/auraJobsData';
import { CANDIDATES_DATABASE, CANDIDATE_DOMAINS, CANDIDATE_AVAILABILITY } from '../data/candidateData';

export default function OpportunitiesPage({
  onApply,
  onOpenPostModal,
  savedJobIds = [],
  onToggleBookmark,
  showToast
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Tab state: 'jobs' (Job Seeker) vs 'candidates' (Recruiter)
  const initialTab = searchParams.get('tab') === 'candidates' ? 'candidates' : 'jobs';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync tab with URL parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'candidates' || tabParam === 'jobs') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', newTab);
    setSearchParams(newParams);
  };

  // -------------------------------------------------------------
  // JOB OPPORTUNITIES STATE (Job Seeker View)
  // -------------------------------------------------------------
  const [jobSearch, setJobSearch] = useState('');
  const [selectedJobCategory, setSelectedJobCategory] = useState('All');
  const [selectedJobLocation, setSelectedJobLocation] = useState('All');
  const [remoteOnly, setRemoteOnly] = useState(false);

  const filteredJobs = useMemo(() => {
    return AURA_JOBS.filter((job) => {
      const matchSearch =
        !jobSearch.trim() ||
        job.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
        job.company.toLowerCase().includes(jobSearch.toLowerCase()) ||
        (job.tags && job.tags.some((t) => t.toLowerCase().includes(jobSearch.toLowerCase())));

      const matchCategory =
        selectedJobCategory === 'All' || job.category === selectedJobCategory;

      const matchLocation =
        selectedJobLocation === 'All' ||
        job.location.toLowerCase().includes(selectedJobLocation.toLowerCase());

      const matchRemote = !remoteOnly || job.location.toLowerCase().includes('remote');

      return matchSearch && matchCategory && matchLocation && matchRemote;
    });
  }, [jobSearch, selectedJobCategory, selectedJobLocation, remoteOnly]);

  // -------------------------------------------------------------
  // CANDIDATE OPPORTUNITIES STATE (Recruiter View)
  // -------------------------------------------------------------
  const [candidateSearch, setCandidateSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [selectedAvailability, setSelectedAvailability] = useState('All Availability');
  const [shortlistedCandidateIds, setShortlistedCandidateIds] = useState(['CAND-901']);
  const [selectedCandidateForInterview, setSelectedCandidateForInterview] = useState(null);
  const [interviewMessage, setInterviewMessage] = useState('');

  const filteredCandidates = useMemo(() => {
    return CANDIDATES_DATABASE.filter((cand) => {
      const matchSearch =
        !candidateSearch.trim() ||
        cand.name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
        cand.title.toLowerCase().includes(candidateSearch.toLowerCase()) ||
        cand.summary.toLowerCase().includes(candidateSearch.toLowerCase()) ||
        cand.primarySkills.some((s) => s.name.toLowerCase().includes(candidateSearch.toLowerCase()));

      const matchDomain =
        selectedDomain === 'All Domains' || cand.domain === selectedDomain;

      const matchAvailability =
        selectedAvailability === 'All Availability' ||
        cand.availability === selectedAvailability;

      return matchSearch && matchDomain && matchAvailability;
    });
  }, [candidateSearch, selectedDomain, selectedAvailability]);

  const handleToggleShortlist = (candId) => {
    setShortlistedCandidateIds((prev) => {
      const exists = prev.includes(candId);
      if (exists) {
        if (showToast) showToast('Kandidat dihapus dari daftar shortlist perekrut.');
        return prev.filter((id) => id !== candId);
      } else {
        if (showToast) showToast('Kandidat berhasil ditambahkan ke shortlist perekrut!');
        return [...prev, candId];
      }
    });
  };

  const handleOpenInterviewModal = (cand) => {
    setSelectedCandidateForInterview(cand);
    setInterviewMessage(
      `Halo ${cand.name}, kami sangat tertarik dengan pengalaman Anda di bidang ${cand.domain}. Kami ingin mengundang Anda untuk sesi perkenalan & wawancara teknis.`
    );
  };

  const handleSendInterviewInvite = () => {
    if (showToast) {
      showToast(`Undangan wawancara berhasil dikirim ke ${selectedCandidateForInterview.name}!`);
    }
    setSelectedCandidateForInterview(null);
  };

  return (
    <div className="w-full bg-[#faf9f7] text-[#1c1917] min-h-screen py-8 sm:py-12 font-mono">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ============================================================== */}
        {/* HEADER & DUAL ROLE OPPORTUNITY SWITCHER                         */}
        {/* ============================================================== */}
        <div className="border-b border-[#D9CFC7] pb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs text-[#8C7A6B] uppercase tracking-widest font-bold mb-1.5">
                <Sparkles size={14} className="text-[#C9B59C]" />
                <span>Executive &amp; Tech Opportunities Network</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#1c1917]">
                {activeTab === 'jobs' ? 'Opportunities for Job Seekers' : 'Candidate Opportunities for Recruiters'}
              </h1>
              <p className="font-serif italic text-sm sm:text-base text-[#57534e] mt-1 max-w-2xl">
                {activeTab === 'jobs'
                  ? 'Temukan dan lamar peluang karier teknologi terkurasi dengan kompensasi transparan dan alur seleksi langsung ke perekrut.'
                  : 'Eksplorasi dan rekrut talenta teknologi siap kerja (Software Engineer, Tech Lead, UI/UX Designer) yang telah diverifikasi.'}
              </p>
            </div>

            {/* Architectural Role Switcher */}
            <div className="flex items-center bg-[#EFE9E3] p-1 border border-[#D9CFC7] shrink-0 self-start md:self-auto">
              <button
                type="button"
                onClick={() => handleTabChange('jobs')}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'jobs'
                    ? 'bg-[#1c1917] text-[#F9F8F6] shadow-sm'
                    : 'text-[#57534e] hover:text-[#1c1917]'
                }`}
              >
                <Briefcase size={14} />
                <span>Job Opportunities (Job Seeker)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('candidates')}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'candidates'
                    ? 'bg-[#1c1917] text-[#F9F8F6] shadow-sm'
                    : 'text-[#57534e] hover:text-[#1c1917]'
                }`}
              >
                <Users size={14} />
                <span>Candidate Bench (Recruiter)</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* ================= TAB 1: JOB SEEKER OPPORTUNITIES ============ */}
        {/* ============================================================== */}
        {activeTab === 'jobs' ? (
          <div className="space-y-6">
            
            {/* Search & Filter Toolbar */}
            <div className="bg-[#EFE9E3] border border-[#D9CFC7] p-4 sm:p-5 space-y-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* Search Bar */}
                <div className="md:col-span-6 relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]" />
                  <input
                    type="text"
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    placeholder="Search opportunities by title, tech stack (React, Go, Figma), or studio..."
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F9F8F6] border border-[#D9CFC7] text-xs text-[#1c1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#1c1917]"
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

                {/* Category Dropdown */}
                <div className="md:col-span-3">
                  <select
                    value={selectedJobCategory}
                    onChange={(e) => setSelectedJobCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#F9F8F6] border border-[#D9CFC7] text-xs text-[#1c1917] focus:outline-none focus:border-[#1c1917]"
                  >
                    <option value="All">All Categories</option>
                    {AURA_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Location Dropdown */}
                <div className="md:col-span-3">
                  <select
                    value={selectedJobLocation}
                    onChange={(e) => setSelectedJobLocation(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#F9F8F6] border border-[#D9CFC7] text-xs text-[#1c1917] focus:outline-none focus:border-[#1c1917]"
                  >
                    <option value="All">All Locations</option>
                    <option value="Remote">100% Remote</option>
                    <option value="Hybrid">Hybrid Work</option>
                    <option value="San Francisco">San Francisco</option>
                    <option value="London">London</option>
                    <option value="New York">New York</option>
                  </select>
                </div>
              </div>

              {/* Quick Filter Pills */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#D9CFC7]/60 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[#78716C] text-[11px] uppercase tracking-wider">Quick Filters:</span>
                  <button
                    type="button"
                    onClick={() => setRemoteOnly(!remoteOnly)}
                    className={`px-2.5 py-1 text-[11px] border transition-all ${
                      remoteOnly
                        ? 'bg-[#1c1917] text-[#F9F8F6] border-[#1c1917] font-bold'
                        : 'bg-[#F9F8F6] text-[#57534e] border-[#D9CFC7] hover:border-[#1c1917]'
                    }`}
                  >
                    {remoteOnly ? '✓ Remote Roles' : '+ Remote Only'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedJobCategory('Product Design')}
                    className={`px-2.5 py-1 text-[11px] border transition-all ${
                      selectedJobCategory === 'Product Design'
                        ? 'bg-[#1c1917] text-[#F9F8F6] border-[#1c1917]'
                        : 'bg-[#F9F8F6] text-[#57534e] border-[#D9CFC7] hover:border-[#1c1917]'
                    }`}
                  >
                    Product Design
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedJobCategory('Founding Engineer')}
                    className={`px-2.5 py-1 text-[11px] border transition-all ${
                      selectedJobCategory === 'Founding Engineer'
                        ? 'bg-[#1c1917] text-[#F9F8F6] border-[#1c1917]'
                        : 'bg-[#F9F8F6] text-[#57534e] border-[#D9CFC7] hover:border-[#1c1917]'
                    }`}
                  >
                    Founding Engineer
                  </button>
                </div>

                <div className="text-[11px] text-[#78716C]">
                  Showing <span className="font-bold text-[#1c1917]">{filteredJobs.length}</span> curated opportunities
                </div>
              </div>
            </div>

            {/* Layout: Main Feed + Right Rail */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Main Opportunities Feed (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                {filteredJobs.length === 0 ? (
                  <div className="bg-[#EFE9E3] border border-[#D9CFC7] p-10 text-center space-y-3">
                    <Briefcase size={28} className="mx-auto text-[#78716C]" />
                    <p className="font-bold text-[#1c1917]">No opportunities match your filter criteria.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setJobSearch('');
                        setSelectedJobCategory('All');
                        setSelectedJobLocation('All');
                        setRemoteOnly(false);
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
                        className="bg-[#F9F8F6] border border-[#D9CFC7] p-5 sm:p-6 hover:border-[#1c1917] transition-all space-y-4 relative group"
                      >
                        {/* Top Meta Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-[#1c1917] text-[#F9F8F6] flex items-center justify-center font-bold text-xs">
                              {job.initial || job.company.charAt(0)}
                            </span>
                            <span className="font-bold text-[#1c1917]">{job.company}</span>
                            <span className="text-[#D9CFC7]">·</span>
                            <span className="text-[#78716C] flex items-center gap-1">
                              <MapPin size={12} />
                              {job.location}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-[#E8F0EA] text-[#2E5C38] border border-[#2E5C38]/30 text-[10px] font-bold uppercase">
                              {job.matchPercentage || 96}% Profile Fit
                            </span>
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
                          </div>
                        </div>

                        {/* Title & Compensation */}
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                          <Link
                            to={`/jobs/${job.id}`}
                            className="font-heading text-lg sm:text-xl font-bold text-[#1c1917] hover:text-[#8C7A6B] transition-colors"
                          >
                            {job.title}
                          </Link>
                          <div className="font-mono text-xs font-bold text-[#1c1917] shrink-0">
                            {job.salary || job.packageTier}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed font-sans">
                          {job.description}
                        </p>

                        {/* Tech Stack / Tags */}
                        {job.tags && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {job.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-[#EFE9E3] border border-[#D9CFC7] text-[10px] text-[#44403C]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Action Footer */}
                        <div className="pt-3 border-t border-[#D9CFC7]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <span className="text-[11px] text-[#78716C]">
                            Verified Studio · Direct Review SLA ~24h
                          </span>

                          <div className="flex items-center gap-2">
                            <Link
                              to={`/jobs/${job.id}`}
                              className="fm-btn text-xs py-1.5 px-3 bg-[#EFE9E3] border-[#D9CFC7] hover:border-[#1c1917]"
                            >
                              <span>View Dossier</span>
                            </Link>

                            <button
                              type="button"
                              onClick={() => onApply && onApply(job)}
                              className="fm-btn fm-btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5"
                            >
                              <span>Quick Apply</span>
                              <ArrowRight size={13} />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>

              {/* Right Rail: Candidate Profile Readiness & Career Intel (4 cols) */}
              <div className="lg:col-span-4 space-y-5">
                
                {/* Profile Readiness Barometer */}
                <div className="bg-[#EFE9E3] border border-[#D9CFC7] p-5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#D9CFC7]">
                    <span className="text-xs uppercase tracking-wider font-bold text-[#1c1917]">
                      Your Candidate Readiness
                    </span>
                    <span className="text-[10px] bg-[#2E5C38] text-[#F9F8F6] px-1.5 py-0.5 font-bold">
                      ACTIVE
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-[#57534e]">ATS Resume Calibration:</span>
                      <span className="font-bold text-[#1c1917]">96% Match</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#D9CFC7]">
                      <div className="h-full bg-[#1c1917] w-[96%]" />
                    </div>
                  </div>

                  <p className="text-[11px] text-[#57534e] font-sans leading-relaxed">
                    Your profile is actively visible to verified partner recruiters hiring for Senior Fullstack and Staff Systems positions.
                  </p>

                  <div className="pt-2">
                    <Link
                      to="/jobs"
                      className="text-xs font-bold text-[#1c1917] hover:text-[#8C7A6B] flex items-center gap-1 uppercase tracking-wider"
                    >
                      <span>Explore Full Catalog →</span>
                    </Link>
                  </div>
                </div>

                {/* Market Intelligence Widget */}
                <div className="bg-[#F9F8F6] border border-[#D9CFC7] p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                    <TrendingUp size={14} className="text-[#8C7A6B]" />
                    <span>In-Demand Tech Skills</span>
                  </div>
                  <div className="space-y-2 text-xs font-sans">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#D9CFC7]/50">
                      <span className="font-mono text-[#1c1917]">React 19 &amp; Next.js</span>
                      <span className="text-[#2E5C38] font-bold font-mono">+38% YoY</span>
                    </div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#D9CFC7]/50">
                      <span className="font-mono text-[#1c1917]">Golang Microservices</span>
                      <span className="text-[#2E5C38] font-bold font-mono">+42% YoY</span>
                    </div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#D9CFC7]/50">
                      <span className="font-mono text-[#1c1917]">AI Agents &amp; LangChain</span>
                      <span className="text-[#2E5C38] font-bold font-mono">+65% YoY</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[#1c1917]">Design Systems (Figma)</span>
                      <span className="text-[#2E5C38] font-bold font-mono">+29% YoY</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* ================= TAB 2: RECRUITER CANDIDATE BENCH =========== */
          /* ============================================================== */
          <div className="space-y-6">
            
            {/* Candidate Search & Scouting Toolbar */}
            <div className="bg-[#EFE9E3] border border-[#D9CFC7] p-4 sm:p-5 space-y-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                
                {/* Search Bar */}
                <div className="md:col-span-6 relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]" />
                  <input
                    type="text"
                    value={candidateSearch}
                    onChange={(e) => setCandidateSearch(e.target.value)}
                    placeholder="Search candidate name, tech stack (React, Golang, SRE), or domain..."
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F9F8F6] border border-[#D9CFC7] text-xs text-[#1c1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#1c1917]"
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

                {/* Domain Selector */}
                <div className="md:col-span-3">
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#F9F8F6] border border-[#D9CFC7] text-xs text-[#1c1917] focus:outline-none focus:border-[#1c1917]"
                  >
                    {CANDIDATE_DOMAINS.map((dom) => (
                      <option key={dom} value={dom}>{dom}</option>
                    ))}
                  </select>
                </div>

                {/* Availability Selector */}
                <div className="md:col-span-3">
                  <select
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#F9F8F6] border border-[#D9CFC7] text-xs text-[#1c1917] focus:outline-none focus:border-[#1c1917]"
                  >
                    {CANDIDATE_AVAILABILITY.map((avail) => (
                      <option key={avail} value={avail}>{avail}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Barometer Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#D9CFC7]/60 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[#2E5C38] font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#2E5C38] animate-pulse" />
                    <span>{filteredCandidates.filter(c => c.availability.includes('Immediately')).length} Available Immediately</span>
                  </div>
                  <span className="text-[#D9CFC7]">|</span>
                  <div className="text-[#57534e]">
                    Shortlisted: <span className="font-bold text-[#1c1917]">{shortlistedCandidateIds.length} Talents</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onOpenPostModal && (
                    <button
                      type="button"
                      onClick={onOpenPostModal}
                      className="fm-btn text-[11px] py-1 px-3 bg-[#F9F8F6] border-[#D9CFC7] hover:border-[#1c1917] flex items-center gap-1"
                    >
                      <PlusCircle size={12} />
                      <span>Post Open Mandate</span>
                    </button>
                  )}
                  <span className="text-[#78716C] text-[11px]">
                    Showing <span className="font-bold text-[#1c1917]">{filteredCandidates.length}</span> vetted candidates
                  </span>
                </div>
              </div>
            </div>

            {/* Layout: Main Candidate Bench + Recruiter Pipeline Rail */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Candidate Cards Grid (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                {filteredCandidates.length === 0 ? (
                  <div className="bg-[#EFE9E3] border border-[#D9CFC7] p-10 text-center space-y-3">
                    <Users size={28} className="mx-auto text-[#78716C]" />
                    <p className="font-bold text-[#1c1917]">No candidates match the selected filters.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setCandidateSearch('');
                        setSelectedDomain('All Domains');
                        setSelectedAvailability('All Availability');
                      }}
                      className="fm-btn text-xs mt-2"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  filteredCandidates.map((cand) => {
                    const isShortlisted = shortlistedCandidateIds.includes(cand.id);
                    return (
                      <article
                        key={cand.id}
                        className="bg-[#F9F8F6] border border-[#D9CFC7] p-5 sm:p-6 hover:border-[#1c1917] transition-all space-y-4 relative"
                      >
                        {/* Candidate Top Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start sm:items-center gap-3.5">
                            <div className="w-12 h-14 shrink-0 border border-[#D9CFC7] p-0.5 bg-[#EFE9E3] overflow-hidden">
                              <img
                                alt={cand.name}
                                src={cand.avatar}
                                className="w-full h-full object-cover object-center filter contrast-[1.03]"
                              />
                            </div>

                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-heading text-lg font-bold text-[#1c1917]">
                                  {cand.name}
                                </h3>
                                <span className="font-mono text-[11px] text-[#78716C]">
                                  {cand.refId}
                                </span>
                                <span className="px-1.5 py-0.5 bg-[#C9B59C]/40 border border-[#8C7A6B]/30 text-[9px] font-bold uppercase text-[#1c1917]">
                                  {cand.verifiedBadge}
                                </span>
                              </div>
                              <p className="font-serif italic text-sm text-[#44403C] mt-0.5">
                                {cand.title}
                              </p>
                              <p className="text-[11px] text-[#78716C] font-mono mt-0.5">
                                {cand.previousCompany} · {cand.yearsOfExperience} Years Exp
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:items-end gap-1 shrink-0">
                            <span className={`px-2 py-0.5 border text-[10px] font-bold uppercase tracking-wider ${cand.availabilityColor}`}>
                              {cand.availability}
                            </span>
                            <span className="font-mono text-xs font-bold text-[#1c1917]">
                              {cand.expectedSalary}
                            </span>
                            <span className="text-[10px] text-[#78716C]">
                              {cand.workPreference}
                            </span>
                          </div>
                        </div>

                        {/* Bio Summary */}
                        <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed font-sans">
                          {cand.summary}
                        </p>

                        {/* Skills Chips */}
                        <div className="flex flex-wrap gap-1.5">
                          {cand.primarySkills.map((sk) => (
                            <span
                              key={sk.name}
                              className="px-2 py-0.5 bg-[#EFE9E3] border border-[#D9CFC7] text-[10px] text-[#1c1917] font-mono flex items-center gap-1"
                            >
                              <span className="font-semibold">{sk.name}</span>
                              <span className="text-[#78716C] text-[9px]">({sk.exp})</span>
                            </span>
                          ))}
                        </div>

                        {/* Recruiter Action Bar */}
                        <div className="pt-3 border-t border-[#D9CFC7]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <span className="text-[11px] text-[#78716C] flex items-center gap-1">
                            <Award size={13} className="text-[#8C7A6B]" />
                            <span>{cand.education}</span>
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleShortlist(cand.id)}
                              className={`fm-btn text-xs py-1.5 px-3 border transition-all ${
                                isShortlisted
                                  ? 'bg-[#1c1917] text-[#F9F8F6] border-[#1c1917] font-bold'
                                  : 'bg-[#EFE9E3] text-[#1c1917] border-[#D9CFC7] hover:border-[#1c1917]'
                              }`}
                            >
                              <Bookmark size={12} className={isShortlisted ? 'fill-[#C9B59C]' : ''} />
                              <span>{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (showToast) showToast(`Mengunduh dossier CV ${cand.name}...`);
                              }}
                              className="fm-btn text-xs py-1.5 px-3 bg-[#EFE9E3] border-[#D9CFC7] hover:border-[#1c1917] flex items-center gap-1"
                              title="Download ATS Dossier"
                            >
                              <Download size={12} />
                              <span className="hidden sm:inline">ATS CV</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenInterviewModal(cand)}
                              className="fm-btn fm-btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5"
                            >
                              <Mail size={12} />
                              <span>Contact / Invite</span>
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>

              {/* Right Rail: Recruiter Pipeline & Mandate Matching (4 cols) */}
              <div className="lg:col-span-4 space-y-5">
                
                {/* Active Scouting Pipeline */}
                <div className="bg-[#EFE9E3] border border-[#D9CFC7] p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#D9CFC7]">
                    <span className="text-xs uppercase tracking-wider font-bold text-[#1c1917]">
                      Recruiter Pipeline
                    </span>
                    <span className="text-[10px] bg-[#1c1917] text-[#F9F8F6] px-1.5 py-0.5 font-bold">
                      BENCH
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-3 bg-[#F9F8F6] border border-[#D9CFC7]">
                      <span className="text-2xl font-bold font-serif text-[#1c1917]">
                        {shortlistedCandidateIds.length}
                      </span>
                      <span className="block text-[10px] text-[#78716C] uppercase mt-0.5">Shortlisted</span>
                    </div>
                    <div className="p-3 bg-[#F9F8F6] border border-[#D9CFC7]">
                      <span className="text-2xl font-bold font-serif text-[#2E5C38]">18</span>
                      <span className="block text-[10px] text-[#78716C] uppercase mt-0.5">Ready to Hire</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#57534e] font-sans leading-relaxed">
                    Shortlisted candidates can be reviewed directly or invited for priority interview rounds with your technical hiring managers.
                  </p>

                  {onOpenPostModal && (
                    <button
                      type="button"
                      onClick={onOpenPostModal}
                      className="w-full fm-btn fm-btn-primary py-2 text-xs flex items-center justify-center gap-2"
                    >
                      <PlusCircle size={13} />
                      <span>Post a New Job Mandate</span>
                    </button>
                  )}
                </div>

                {/* Recruiter Hiring Advisory */}
                <div className="bg-[#F9F8F6] border border-[#D9CFC7] p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                    <ShieldCheck size={14} className="text-[#8C7A6B]" />
                    <span>Scouting SLA &amp; Warranty</span>
                  </div>
                  <ul className="text-xs font-sans text-[#44403C] space-y-2 leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#2E5C38] font-bold">✓</span>
                      <span><strong>100% Blind Screening:</strong> Technical skills tested prior to client introduction.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#2E5C38] font-bold">✓</span>
                      <span><strong>90-Day Retention Warranty:</strong> Free candidate replacement policy.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#2E5C38] font-bold">✓</span>
                      <span><strong>Direct Outreach:</strong> 96% candidate response rate within 24 hours.</span>
                    </li>
                  </ul>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* MODAL: DIRECT INTERVIEW INVITATION (Recruiter -> Candidate)   */}
      {/* ============================================================== */}
      {selectedCandidateForInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#F9F8F6] border border-[#1c1917] max-w-lg w-full p-6 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9CFC7]">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#1c1917]">
                  Send Interview Invitation
                </h3>
                <span className="text-xs text-[#78716C]">
                  To: {selectedCandidateForInterview.name} ({selectedCandidateForInterview.refId})
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
                  Target Role / Open Mandate:
                </label>
                <input
                  type="text"
                  defaultValue={selectedCandidateForInterview.title}
                  className="w-full p-2.5 bg-[#EFE9E3] border border-[#D9CFC7] text-[#1c1917] focus:outline-none focus:border-[#1c1917]"
                />
              </div>

              <div>
                <label className="block text-[#78716C] uppercase tracking-wider mb-1">
                  Invitation Message &amp; Brief:
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
                <span>Send Invitation</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
