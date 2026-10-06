import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  Download,
  Mail,
  CheckCircle2,
  Briefcase,
  Users,
  Award,
  Calendar,
  Sparkles,
  ShieldCheck,
  Code,
  Terminal,
  Layers,
  LayoutDashboard,
  Plus,
  FileText
} from 'lucide-react';

export default function ProfilePage({ showToast }) {
  const navigate = useNavigate();
  const { user, isLoggedIn, isRecruiter, isJobSeeker } = useAuth();

  const isRecruiterRole = isRecruiter || user?.role === 'recruiter';
  const displayName = user?.name || (isRecruiterRole ? 'Tech Recruiter Partner' : 'Senior Software Engineer');
  const displayEmail = user?.email || (isRecruiterRole ? 'recruiter@jobhunt.bzh' : 'engineer@jobhunt.bzh');
  const refCode = user?.id ? (isRecruiterRole ? `ID-REC-${user.id}` : `ID-DEV-${user.id}`) : (isRecruiterRole ? 'ID-REC-4029' : 'ID-DEV-0829');

  const handleDownloadCV = (e) => {
    e.preventDefault();
    if (showToast) {
      showToast('Downloading verified ATS Resume dossier...');
    }
  };

  return (
    <div className="w-full bg-[#faf9f7] text-[#1C1917] min-h-screen py-10 sm:py-16 font-mono">
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 space-y-12 sm:space-y-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#D9CFC7] pb-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#78716C] uppercase tracking-wider">ACCOUNT ROLE:</span>
            <span className="font-bold text-[#1C1917] px-2.5 py-1 bg-[#EFE9E3] border border-[#D9CFC7]">
              {isRecruiterRole
                ? '💼 IT RECRUITER (Talent Acquisition & Sourcing)'
                : '💻 IT JOB SEEKER (Software Engineering & Tech Talent)'}
            </span>
          </div>
        </div>
        {isRecruiterRole ? (
          <>
            <section className="space-y-8">
              <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-8 md:gap-12">
                <div className="space-y-4 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] tracking-wider uppercase">
                    <span className="inline-flex items-center gap-1.5 text-[#8C7A6B]">
                      <Briefcase size={13} />
                      Senior Tech Recruiter · {refCode}
                    </span>
                    <span className="text-[#D9CFC7]">|</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#E8F0EA] text-[#2E5C38] border border-[#2E5C38]/30 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2E5C38] animate-pulse" />
                      Actively Hiring Tech Talent
                    </span>
                  </div>

                  <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#1C1917] font-bold tracking-tight leading-[1.15]">
                    {displayName}
                  </h1>

                  <p className="font-serif text-lg sm:text-xl text-[#44403C] italic font-normal">
                    Talent Acquisition Partner &amp; IT Recruiter
                  </p>

                  <p className="text-sm sm:text-base text-[#1C1917] leading-relaxed font-sans pt-1">
                    Connecting top-tier software engineers, DevOps specialists, and product designers with high-growth tech startups and industry leaders. Helping companies build resilient engineering teams while placing developers in roles they love.
                  </p>
                </div>
                <div className="w-36 h-44 sm:w-44 sm:h-56 shrink-0 relative border border-[#D9CFC7] p-1.5 bg-[#F9F8F6] shadow-sm">
                  <img
                    alt={`${displayName} IT Recruiter`}
                    className="w-full h-full object-cover object-center filter contrast-[1.03]"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"
                  />
                  <div className="absolute bottom-2.5 right-2.5 bg-[#1C1917] text-[#F9F8F6] px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold">
                    Verified Recruiter
                  </div>
                </div>
              </div>
            </section>

            {/* Recruiter Track Record & Metrics */}
            <section className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-[#D9CFC7] pb-2">
                <h2 className="font-heading text-xl sm:text-2xl text-[#1C1917] font-bold">
                  Track Record &amp; Placement Metrics
                </h2>
                <span className="text-xs text-[#78716C] uppercase tracking-wider">
                  VERIFIED
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 border border-[#D9CFC7] bg-[#EFE9E3]/40 space-y-1">
                  <span className="text-[11px] text-[#78716C] uppercase tracking-wider block">
                    Placed Talents
                  </span>
                  <div className="font-heading text-2xl sm:text-3xl font-bold text-[#1C1917]">160+</div>
                  <p className="text-[11px] text-[#44403C] font-sans">Engineers &amp; Tech Leads</p>
                </div>

                <div className="p-4 border border-[#D9CFC7] bg-[#EFE9E3]/40 space-y-1">
                  <span className="text-[11px] text-[#78716C] uppercase tracking-wider block">
                    Match Rate
                  </span>
                  <div className="font-heading text-2xl sm:text-3xl font-bold text-[#2E5C38]">98%</div>
                  <p className="text-[11px] text-[#44403C] font-sans">Retention &amp; Quality Fit</p>
                </div>

                <div className="p-4 border border-[#D9CFC7] bg-[#EFE9E3]/40 space-y-1">
                  <span className="text-[11px] text-[#78716C] uppercase tracking-wider block">
                    Hiring Speed
                  </span>
                  <div className="font-heading text-2xl sm:text-3xl font-bold text-[#1C1917]">14 Days</div>
                  <p className="text-[11px] text-[#44403C] font-sans">Interview to Signed Offer</p>
                </div>

                <div className="p-4 border border-[#D9CFC7] bg-[#EFE9E3]/40 space-y-1">
                  <span className="text-[11px] text-[#78716C] uppercase tracking-wider block">
                    Talent Network
                  </span>
                  <div className="font-heading text-2xl sm:text-3xl font-bold text-[#1C1917]">10,000+</div>
                  <p className="text-[11px] text-[#44403C] font-sans">Screened Tech Professionals</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-[#D9CFC7] pb-3">
                <h2 className="font-heading text-xl sm:text-2xl text-[#1C1917] font-bold">
                  IT Disciplines I Specialize In
                </h2>
                <span className="text-xs text-[#78716C] tracking-wider uppercase">
                  SPECIALTIES
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 border border-[#D9CFC7] bg-[#F9F8F6] space-y-2">
                  <div className="flex items-center gap-2 text-[#1C1917] font-semibold text-sm">
                    <Code size={16} className="text-[#8C7A6B]" />
                    <span>Software Engineering</span>
                  </div>
                  <p className="text-[#44403C] font-sans text-xs leading-relaxed">
                    Frontend Developers, Backend Engineers, Fullstack Programmers, and Mobile App Engineers (iOS, Android, React Native).
                  </p>
                </div>

                <div className="p-4 border border-[#D9CFC7] bg-[#F9F8F6] space-y-2">
                  <div className="flex items-center gap-2 text-[#1C1917] font-semibold text-sm">
                    <Terminal size={16} className="text-[#8C7A6B]" />
                    <span>DevOps &amp; Cloud Infrastructure</span>
                  </div>
                  <p className="text-[#44403C] font-sans text-xs leading-relaxed">
                    Cloud Engineers (AWS, GCP), Site Reliability Engineers (SRE), Kubernetes specialists, and Cyber Security professionals.
                  </p>
                </div>

                <div className="p-4 border border-[#D9CFC7] bg-[#F9F8F6] space-y-2">
                  <div className="flex items-center gap-2 text-[#1C1917] font-semibold text-sm">
                    <Layers size={16} className="text-[#8C7A6B]" />
                    <span>Product &amp; UI/UX Design</span>
                  </div>
                  <p className="text-[#44403C] font-sans text-xs leading-relaxed">
                    Product Managers, UI/UX Designers, User Researchers, and QA Software Testers (Manual &amp; Automation).
                  </p>
                </div>

                <div className="p-4 border border-[#D9CFC7] bg-[#F9F8F6] space-y-2">
                  <div className="flex items-center gap-2 text-[#1C1917] font-semibold text-sm">
                    <Users size={16} className="text-[#8C7A6B]" />
                    <span>Tech Leadership &amp; Management</span>
                  </div>
                  <p className="text-[#44403C] font-sans text-xs leading-relaxed">
                    Technical Leads, Engineering Managers, Directors of Engineering, and Chief Technology Officers (CTO).
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="space-y-8">
              <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-8 md:gap-12">
                <div className="space-y-4 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] tracking-wider uppercase">
                    <span className="inline-flex items-center gap-1.5 text-[#8C7A6B]">
                      <Code size={13} />
                      IT Job Seeker Profile · {refCode}
                    </span>
                    <span className="text-[#D9CFC7]">|</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#E8F0EA] text-[#2E5C38] border border-[#2E5C38]/30 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2E5C38] animate-pulse" />
                      Open to Work (Full-Time / Remote)
                    </span>
                  </div>

                  <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-[#1C1917] font-bold tracking-tight leading-[1.15]">
                    {displayName}
                  </h1>

                  <p className="font-serif text-lg sm:text-xl text-[#44403C] italic font-normal">
                    Senior Fullstack Developer &amp; UI/UX Specialist
                  </p>

                  <p className="text-sm sm:text-base text-[#1C1917] leading-relaxed font-sans pt-1">
                    Seasoned software engineer with 8+ years of hands-on experience developing modern web applications, resilient backend architectures, and polished user interfaces. Proficient with React, Node.js, and PostgreSQL. Currently seeking new Full-Time or Remote engineering opportunities.
                  </p>

                  {/* Job Seeker Actions */}
                  <div className="pt-3 flex flex-wrap items-center gap-3 text-xs">
                    <Link
                      to="/opportunities?tab=jobs"
                      className="fm-btn fm-btn-primary px-5 py-2.5 inline-flex items-center gap-2"
                    >
                      <Briefcase size={14} />
                      <span>Explore Job Openings</span>
                      <ArrowRight size={14} />
                    </Link>

                    <Link
                      to="/applications"
                      className="fm-btn px-5 py-2.5 inline-flex items-center gap-2 bg-[#F9F8F6] border border-[#D9CFC7] hover:bg-[#EFE9E3] hover:border-[#1C1917] transition-all"
                    >
                      <FileText size={14} />
                      <span>My Applications</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleDownloadCV}
                      className="fm-btn px-4 py-2.5 inline-flex items-center gap-1.5 bg-[#EFE9E3] border border-[#D9CFC7] hover:border-[#1C1917] transition-all"
                      title="Download ATS Dossier"
                    >
                      <Download size={14} />
                      <span>ATS Resume</span>
                    </button>
                  </div>
                </div>

                <div className="w-36 h-44 sm:w-44 sm:h-56 shrink-0 relative border border-[#D9CFC7] p-1.5 bg-[#F9F8F6] shadow-sm">
                  <img
                    alt={`${displayName} IT Job Seeker`}
                    className="w-full h-full object-cover object-center filter contrast-[1.03]"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"
                  />
                  <div className="absolute bottom-2.5 right-2.5 bg-[#1C1917] text-[#F9F8F6] px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold">
                    Active Tech Talent
                  </div>
                </div>
              </div>
            </section>

            {/* Technical Skills & Stack */}
            <section className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-[#D9CFC7] pb-2">
                <h2 className="font-heading text-xl sm:text-2xl text-[#1C1917] font-bold">
                  Technical Skills &amp; Stack
                </h2>
                <span className="text-xs text-[#78716C] uppercase tracking-wider">
                  CORE PROFICIENCIES
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 border border-[#D9CFC7] bg-[#EFE9E3]/40 space-y-2">
                  <span className="font-bold text-[#1C1917] flex items-center gap-1.5">
                    <Code size={14} className="text-[#8C7A6B]" />
                    Frontend Development
                  </span>
                  <p className="text-[#44403C] font-sans text-xs">
                    React.js, Next.js, TypeScript, Tailwind CSS, HTML5/CSS3, State Management (Zustand/Redux).
                  </p>
                </div>

                <div className="p-4 border border-[#D9CFC7] bg-[#EFE9E3]/40 space-y-2">
                  <span className="font-bold text-[#1C1917] flex items-center gap-1.5">
                    <Terminal size={14} className="text-[#8C7A6B]" />
                    Backend &amp; Databases
                  </span>
                  <p className="text-[#44403C] font-sans text-xs">
                    Node.js, Express, Golang, PostgreSQL, MySQL, REST API, JWT Authentication.
                  </p>
                </div>

                <div className="p-4 border border-[#D9CFC7] bg-[#EFE9E3]/40 space-y-2">
                  <span className="font-bold text-[#1C1917] flex items-center gap-1.5">
                    <Layers size={14} className="text-[#8C7A6B]" />
                    Design &amp; DevOps
                  </span>
                  <p className="text-[#44403C] font-sans text-xs">
                    Figma (UI/UX), Git &amp; GitHub, Docker, Postman, CI/CD, Agile/Scrum.
                  </p>
                </div>
              </div>
            </section>

            {/* Work Experience */}
            <section className="space-y-6">
              <div className="flex items-baseline justify-between border-b border-[#D9CFC7] pb-3">
                <h2 className="font-heading text-xl sm:text-2xl text-[#1C1917] font-bold">
                  Professional Work Experience
                </h2>
                <span className="text-xs text-[#78716C] tracking-wider uppercase">
                  TIMELINE
                </span>
              </div>

              <div className="space-y-8">
                <article className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-lg font-bold text-[#1C1917]">
                        Senior Fullstack Developer
                      </h3>
                      <span className="text-xs text-[#78716C]">
                        — PT Nusantara FinTek
                      </span>
                    </div>
                    <span className="text-xs text-[#44403C] shrink-0">
                      Nov 2021 — Present (Full-Time)
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed font-sans">
                    Architected and scaled digital banking web applications. Accelerated customer verification throughput by 150%, reduced page load times to under 1.5 seconds, and mentored engineering teammates.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-[#78716C]">
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">React.js</span>
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">Node.js</span>
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">PostgreSQL</span>
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">Docker</span>
                  </div>
                </article>

                <article className="space-y-2 border-t border-[#D9CFC7]/50 pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-lg font-bold text-[#1C1917]">
                        Frontend Developer &amp; UI Lead
                      </h3>
                      <span className="text-xs text-[#78716C]">
                        — Tokopedia / GoTo Group
                      </span>
                    </div>
                    <span className="text-xs text-[#44403C] shrink-0">
                      Aug 2018 — Oct 2021
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed font-sans">
                    Built unified checkout and payment flows serving 40M+ monthly active users. Reduced checkout drop-off rates by 18% through responsive UI enhancements.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-[#78716C]">
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">TypeScript</span>
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">React</span>
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">Tailwind CSS</span>
                  </div>
                </article>
              </div>
            </section>
            <section className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-[#D9CFC7] pb-3">
                <h2 className="font-heading text-xl sm:text-2xl text-[#1C1917] font-bold">
                  Education &amp; Verified Certifications
                </h2>
                <span className="text-xs text-[#78716C] tracking-wider uppercase">
                  VERIFIED
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-[#D9CFC7]/40 gap-1">
                  <div>
                    <span className="font-bold text-[#1C1917]">Institut Teknologi Bandung (ITB)</span>
                    <span className="text-[#44403C] ml-2">— B.Sc. &amp; M.Sc. in Computer Science</span>
                  </div>
                  <span className="text-[#78716C]">Magna Cum Laude Honors</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-[#D9CFC7]/40 gap-1">
                  <div>
                    <span className="font-bold text-[#1C1917]">Google Cloud Certified</span>
                    <span className="text-[#44403C] ml-2">— Associate Cloud Engineer</span>
                  </div>
                  <span className="text-[#78716C]">Cloud Infrastructure</span>
                </div>
              </div>
            </section>
          </>
        )}

      </main>
    </div>
  );
}
