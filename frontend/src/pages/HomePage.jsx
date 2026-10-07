import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Building2, MapPin, Sparkles, PlusCircle, CheckCircle2, TrendingUp, Users, LayoutDashboard, Plus } from 'lucide-react';
import { jobService } from '../services/jobService';
import { useAuth } from '../context/AuthContext';

export default function HomePage({ onOpenPostModal, showToast }) {
  const { isLoggedIn, isRecruiter, isJobSeeker, user } = useAuth();

  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    typesBreakdown: []
  });
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, jobsRes] = await Promise.all([
          jobService.getJobStats().catch(() => ({ data: { totalJobs: 8, totalCompanies: 6, typesBreakdown: [] } })),
          jobService.getJobs({ page: 1, limit: 3 }).catch(() => ({ data: { jobs: [] } }))
        ]);

        if (statsRes && statsRes.data) {
          setStats(statsRes.data);
        }
        if (jobsRes && jobsRes.data && jobsRes.data.jobs) {
          setFeaturedJobs(jobsRes.data.jobs);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full flex flex-col font-mono">

      <section className="relative overflow-hidden pt-12 pb-20 border-b border-[#D9CFC7]">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[320px] bg-[#f2dcc2]/30 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EFE9E3] border border-[#D9CFC7] font-mono text-[11px] text-[#6b5c47] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#6b5c47] animate-pulse"></span>
              <span className="font-bold tracking-widest uppercase">
                {isRecruiter ? 'Recruiter Console • Talent Index' : 'Bespoke Advisory Index • Issue Nº 42'}
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1c1917] tracking-tight leading-[1.15] mb-6">
              {isRecruiter ? (
                <>
                  Connect with elite engineering &{' '}
                  <span className="italic font-serif font-normal text-[#6b5c47]">creative talent</span>.
                </>
              ) : (
                <>
                  Discover roles shaped around{' '}
                  <span className="italic font-serif font-normal text-[#6b5c47]">your ambition</span>.
                </>
              )}
            </h1>

            <p className="font-serif italic text-lg sm:text-xl text-[#57534e] max-w-2xl leading-relaxed mb-8">
              {isRecruiter
                ? 'An exclusive platform for recruiters to discover top engineering talent, manage candidates, and publish job openings.'
                : 'A curated index of software engineering, design, and tech career opportunities for passionate professionals.'}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 font-mono text-xs">

              {isLoggedIn && isRecruiter && (
                <>
                  <Link
                    to="/opportunities?tab=candidates"
                    className="fm-btn fm-btn-primary px-7 py-3 text-[12px] flex items-center justify-center gap-2 shadow-md hover:translate-x-0.5 transition-transform"
                  >
                    <Users size={14} />
                    <span>Candidate Bench</span>
                    <ArrowRight size={14} />
                  </Link>

                  <Link
                    to="/dashboard"
                    className="fm-btn px-6 py-3 text-[12px] flex items-center justify-center gap-2 border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917] hover:border-[#1c1917] hover:bg-[#F9F8F6] transition-all"
                  >
                    <LayoutDashboard size={14} />
                    <span>Recruiter Dashboard</span>
                  </Link>
                </>
              )}

              {isLoggedIn && isJobSeeker && (
                <>
                  <Link
                    to="/opportunities?tab=jobs"
                    className="fm-btn fm-btn-primary px-7 py-3 text-[12px] flex items-center justify-center gap-2 shadow-md hover:translate-x-0.5 transition-transform"
                  >
                    <Briefcase size={14} />
                    <span>Explore Jobs</span>
                    <ArrowRight size={14} />
                  </Link>

                  <Link
                    to="/applications"
                    className="fm-btn px-5 py-3 text-[12px] flex items-center justify-center gap-2 border-[#D9CFC7] bg-[#F9F8F6] text-[#57534e] hover:border-[#1c1917] hover:text-[#1c1917] transition-all"
                  >
                    <span>My Applications</span>
                  </Link>
                </>
              )}

              {!isLoggedIn && (
                <>
                  <Link
                    to="/opportunities?tab=jobs"
                    className="fm-btn fm-btn-primary px-7 py-3 text-[12px] flex items-center justify-center gap-2 shadow-md hover:translate-x-0.5 transition-transform"
                  >
                    <Briefcase size={14} />
                    <span>Explore Jobs</span>
                    <ArrowRight size={14} />
                  </Link>

                  <Link
                    to="/login"
                    className="fm-btn px-6 py-3 text-[12px] flex items-center justify-center gap-2 border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917] hover:border-[#1c1917] hover:bg-[#F9F8F6] transition-all"
                  >
                    <PlusCircle size={14} />
                    <span>Post a Job (Recruiters)</span>
                  </Link>
                </>
              )}

            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#EFE9E3] border-b border-[#D9CFC7] py-8 sm:py-10 font-mono">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#D9CFC7]">

            <div className="flex flex-col sm:px-4 first:pl-0 pt-0">
              <div className="flex items-center gap-2 text-[#78716c] text-[11px] uppercase tracking-wider mb-1">
                <Briefcase size={14} className="text-[#6b5c47]" />
                <span>Active Job Openings</span>
              </div>
              <div className="font-heading text-2xl sm:text-3xl font-bold text-[#1c1917]">
                {loading ? '...' : stats.totalJobs || 8}
              </div>
              <p className="text-[11px] text-[#78716c] mt-1 font-sans">
                Verified roles from trusted tech companies.
              </p>
            </div>

            <div className="flex flex-col sm:px-6 pt-4 sm:pt-0">
              <div className="flex items-center gap-2 text-[#78716c] text-[11px] uppercase tracking-wider mb-1">
                <Building2 size={14} className="text-[#6b5c47]" />
                <span>Verified Companies</span>
              </div>
              <div className="font-heading text-2xl sm:text-3xl font-bold text-[#1c1917]">
                {loading ? '...' : stats.totalCompanies || 6}
              </div>
              <p className="text-[11px] text-[#78716c] mt-1 font-sans">
                Tech startups, engineering studios, and enterprises.
              </p>
            </div>

            <div className="flex flex-col sm:px-6 pt-4 sm:pt-0">
              <div className="flex items-center gap-2 text-[#78716c] text-[11px] uppercase tracking-wider mb-1">
                <TrendingUp size={14} className="text-[#6b5c47]" />
                <span>Featured Talents</span>
              </div>
              <div className="font-heading text-2xl sm:text-3xl font-bold text-[#1c1917]">
                48+
              </div>
              <p className="text-[11px] text-[#78716c] mt-1 font-sans">
                Screened tech professionals ready to hire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {isLoggedIn && isRecruiter ? (
        <section className="py-12 sm:py-16 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="bg-[#F9F8F6] border border-[#D9CFC7] p-6 sm:p-10 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9CFC7]">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#6b5c47] font-semibold">
                  Recruiter Console
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1c1917] tracking-tight mt-1">
                  Explore Top Candidate Profiles
                </h2>
                <p className="text-xs text-[#57534e] mt-1 max-w-xl">
                  Find ready-to-hire developers in Candidate Bench or manage your listings in Recruiter Dashboard.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
              <div className="border border-[#D9CFC7] bg-[#EFE9E3] p-4">
                <span className="text-[10px] uppercase font-bold text-[#78716c]">Step 1</span>
                <h4 className="font-heading font-bold text-sm text-[#1c1917] mt-1">Post a Job</h4>
                <p className="text-xs text-[#57534e] mt-1">
                  Create a new position with salary ranges and clear requirements.
                </p>
                <Link to="/jobs/create" className="text-xs font-bold text-[#1c1917] underline mt-3 inline-block">
                  Start Posting &rarr;
                </Link>
              </div>

              <div className="border border-[#D9CFC7] bg-[#EFE9E3] p-4">
                <span className="text-[10px] uppercase font-bold text-[#78716c]">Step 2</span>
                <h4 className="font-heading font-bold text-sm text-[#1c1917] mt-1">Review Applicants</h4>
                <p className="text-xs text-[#57534e] mt-1">
                  View applicant cover notes and update application status easily.
                </p>
                <Link to="/dashboard" className="text-xs font-bold text-[#1c1917] underline mt-3 inline-block">
                  Go to Dashboard &rarr;
                </Link>
              </div>

              <div className="border border-[#D9CFC7] bg-[#EFE9E3] p-4">
                <span className="text-[10px] uppercase font-bold text-[#78716c]">Step 3</span>
                <h4 className="font-heading font-bold text-sm text-[#1c1917] mt-1">Candidate Bench</h4>
                <p className="text-xs text-[#57534e] mt-1">
                  Browse verified software engineers and designers directly.
                </p>
                <Link to="/opportunities?tab=candidates" className="text-xs font-bold text-[#1c1917] underline mt-3 inline-block">
                  Find Talent &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (

        <section className="py-12 sm:py-16 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#6b5c47] font-semibold">
                Curated Opportunities Stream
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1c1917] tracking-tight mt-1">
                Featured Jobs This Week
              </h2>
            </div>
            <Link
              to="/opportunities?tab=jobs"
              className="font-mono text-xs font-semibold text-[#1c1917] hover:text-[#6b5c47] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <span>View All Jobs ({stats.totalJobs || '24+'})</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredJobs.map((job) => (
              <article
                key={job.id}
                className="bg-[#F9F8F6] border border-[#D9CFC7] p-4 sm:p-6 flex flex-col justify-between hover:border-[#1c1917] hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#78716c] mb-3">
                    <span className="font-bold text-[#6b5c47] uppercase tracking-wider truncate max-w-[180px]">
                      {job.company}
                    </span>
                    <span className="bg-[#EFE9E3] border border-[#D9CFC7] px-2 py-0.5 uppercase text-[10px] shrink-0">
                      {job.type}
                    </span>
                  </div>

                  <h3 className="font-heading text-base sm:text-lg font-bold text-[#1c1917] group-hover:text-[#6b5c47] transition-colors leading-snug mb-2">
                    {job.title}
                  </h3>

                  <p className="font-sans text-xs text-[#57534e] line-clamp-3 mb-4 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D9CFC7]/60 flex items-center justify-between font-mono text-[11px] gap-2">
                  <div className="flex items-center gap-1 text-[#78716c] min-w-0">
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate max-w-[130px] sm:max-w-[160px]">{job.location || 'Remote'}</span>
                  </div>

                  <Link
                    to={`/jobs/${job.id}`}
                    className="font-bold text-[#1c1917] hover:text-[#6b5c47] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>View Details</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
