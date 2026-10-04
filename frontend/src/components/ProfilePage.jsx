import React, { useState } from 'react';
import {
  ArrowRight,
  Download,
  Mail,
  ExternalLink,
  CheckCircle2,
  Briefcase,
  Users,
  Award,
  Clock,
  TrendingUp,
  Building2,
  Calendar,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Code,
  Terminal,
  Layers
} from 'lucide-react';

export default function ProfilePage({ user, onLogout, showToast }) {
  // Automatically adapt to the logged in user's role (recruiter vs job_seeker), with interactive fallback toggle
  const defaultRoleView = user?.role === 'recruiter' ? 'recruiter' : 'job_seeker';
  const [activeRoleView, setActiveRoleView] = useState(defaultRoleView);

  // Dynamic Candidate Data (IT Job Seeker)
  const candidateName = user?.name || 'Dian Sastrowidjoyo';
  const candidateEmail = user?.email || 'dian.sastrowidjoyo@talenta.it';
  const candidateRef = user?.id ? `ID-DEV-${user.id}` : 'ID-DEV-0829';

  // Dynamic Recruiter Data (IT Recruiter)
  const recruiterName = user?.role === 'recruiter' ? user.name : 'Alexander Surya Hadikusumo';
  const recruiterEmail = user?.role === 'recruiter' ? user.email : 'alexander.recruiter@talenta.it';
  const recruiterRef = user?.id ? `ID-REC-${user.id}` : 'ID-REC-4029';

  const handleDownloadCV = (e) => {
    e.preventDefault();
    if (showToast) {
      showToast('Downloading ATS Resume dossier...');
    }
  };

  const handleActionToast = (message) => {
    if (showToast) {
      showToast(message);
    }
  };

  return (
    <div className="w-full bg-[#F9F8F6] text-[#1C1917] selection:bg-[#C9B59C]/40 selection:text-[#1C1917]">
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16">
        
        {/* ============================================================== */}
        {/* ROLE INDICATOR & SWITCHER (Clear, Intuitive, Fast Preview)      */}
        {/* ============================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#D9CFC7] pb-4 gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[#78716C] uppercase tracking-wider">CURRENT VIEW:</span>
            <span className="font-bold text-[#1C1917] px-2.5 py-1 bg-[#EFE9E3] border border-[#D9CFC7]">
              {activeRoleView === 'recruiter' 
                ? '💼 IT RECRUITER (Tech Talent Acquisition)' 
                : '💻 IT JOB SEEKER (Software Engineer & Tech Talent)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#78716C] hidden md:inline">Switch View:</span>
            <button
              type="button"
              onClick={() => setActiveRoleView('job_seeker')}
              className={`px-3 py-1.5 border transition-all text-[11px] uppercase tracking-wider ${
                activeRoleView === 'job_seeker'
                  ? 'bg-[#1C1917] text-[#F9F8F6] border-[#1C1917] font-bold shadow-sm'
                  : 'bg-[#F9F8F6] text-[#57534e] border-[#D9CFC7] hover:border-[#1C1917]'
              }`}
            >
              [IT Job Seeker]
            </button>
            <button
              type="button"
              onClick={() => setActiveRoleView('recruiter')}
              className={`px-3 py-1.5 border transition-all text-[11px] uppercase tracking-wider ${
                activeRoleView === 'recruiter'
                  ? 'bg-[#1C1917] text-[#F9F8F6] border-[#1C1917] font-bold shadow-sm'
                  : 'bg-[#F9F8F6] text-[#57534e] border-[#D9CFC7] hover:border-[#1C1917]'
              }`}
            >
              [IT Recruiter]
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* =================== VIEW 1: IT RECRUITER ===================== */}
        {/* ============================================================== */}
        {activeRoleView === 'recruiter' ? (
          <>
            {/* 1. HERO IT RECRUITER */}
            <section className="space-y-8">
              <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-8 md:gap-12">
                <div className="space-y-4 max-w-xl">
                  
                  {/* Status Badges */}
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-wider uppercase">
                    <span className="inline-flex items-center gap-1.5 text-[#8C7A6B]">
                      <Briefcase size={13} />
                      Senior Tech Recruiter · {recruiterRef}
                    </span>
                    <span className="text-[#D9CFC7]">|</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#E8F0EA] text-[#2E5C38] border border-[#2E5C38]/30 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2E5C38] animate-pulse" />
                      Actively Hiring Tech Talent
                    </span>
                  </div>

                  <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1C1917] font-normal tracking-tight leading-[1.15]">
                    {recruiterName}
                  </h1>

                  <p className="font-serif text-xl sm:text-2xl text-[#44403C] italic font-normal">
                    Senior IT Recruiter &amp; Talent Acquisition Partner
                  </p>

                  <p className="text-sm sm:text-base text-[#1C1917] leading-relaxed font-sans pt-1">
                    Connecting top-tier software engineers, DevOps specialists, and product designers with high-growth tech startups and industry leaders. Helping companies build resilient engineering teams while placing developers in roles they love.
                  </p>

                  {/* Actions */}
                  <div className="pt-3 flex flex-wrap items-center gap-3 font-mono text-xs">
                    <a
                      className="fm-btn fm-btn-primary px-5 py-2.5 inline-flex items-center gap-2"
                      href={`mailto:${recruiterEmail}?subject=Tech%20Hiring%20Inquiry`}
                    >
                      <Mail size={14} />
                      <span>Submit IT Hiring Request</span>
                      <ArrowRight size={14} />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleActionToast('Opening consultation scheduler...')}
                      className="fm-btn px-5 py-2.5 inline-flex items-center gap-2 bg-[#F9F8F6] border border-[#D9CFC7] hover:bg-[#EFE9E3] hover:border-[#1C1917] transition-all"
                    >
                      <Calendar size={14} />
                      <span>Schedule Consultation</span>
                    </button>
                  </div>
                </div>

                {/* Recruiter Photo */}
                <div className="w-36 h-44 sm:w-44 sm:h-56 shrink-0 relative border border-[#D9CFC7] p-1.5 bg-[#F9F8F6] shadow-sm">
                  <img
                    alt={`${recruiterName} IT Recruiter`}
                    className="w-full h-full object-cover object-center filter contrast-[1.03]"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"
                  />
                  <div className="absolute bottom-2.5 right-2.5 bg-[#1C1917] text-[#F9F8F6] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider">
                    Verified IT Recruiter
                  </div>
                </div>
              </div>
            </section>

            {/* 2. RECRUITMENT METRICS */}
            <section className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-[#D9CFC7] pb-2">
                <h2 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-normal">
                  Track Record &amp; Placement Metrics
                </h2>
                <span className="font-mono text-xs text-[#78716C]">
                  VERIFIED
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 border border-[#D9CFC7] bg-[#EFE9E3]/40 space-y-1">
                  <span className="font-mono text-[11px] text-[#78716C] uppercase tracking-wider block">
                    Placed Tech Talents
                  </span>
                  <div className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">160+</div>
                  <p className="text-[11px] text-[#44403C] font-sans">Software Engineers &amp; Tech Leads</p>
                </div>

                <div className="p-4 border border-[#D9CFC7] bg-[#EFE9E3]/40 space-y-1">
                  <span className="font-mono text-[11px] text-[#78716C] uppercase tracking-wider block">
                    Match Success Rate
                  </span>
                  <div className="font-serif text-2xl sm:text-3xl font-semibold text-[#2E5C38]">98%</div>
                  <p className="text-[11px] text-[#44403C] font-sans">Company &amp; Candidate Fit</p>
                </div>

                <div className="p-4 border border-[#D9CFC7] bg-[#EFE9E3]/40 space-y-1">
                  <span className="font-mono text-[11px] text-[#78716C] uppercase tracking-wider block">
                    Avg. Hiring Speed
                  </span>
                  <div className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">14 Days</div>
                  <p className="text-[11px] text-[#44403C] font-sans">Interview to Accepted Offer</p>
                </div>

                <div className="p-4 border border-[#D9CFC7] bg-[#EFE9E3]/40 space-y-1">
                  <span className="font-mono text-[11px] text-[#78716C] uppercase tracking-wider block">
                    Developer Community
                  </span>
                  <div className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">10,000+</div>
                  <p className="text-[11px] text-[#44403C] font-sans">Vetted Engineers in APAC Network</p>
                </div>
              </div>
            </section>

            {/* 3. OPEN IT JOB OPENINGS */}
            <section className="space-y-6">
              <div className="flex items-baseline justify-between border-b border-[#D9CFC7] pb-3">
                <div className="flex items-center gap-3">
                  <h2 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-normal">
                    Open IT Job Openings
                  </h2>
                  <span className="px-2 py-0.5 bg-[#1C1917] text-[#F9F8F6] font-mono text-[11px] font-semibold">
                    3 ACTIVE ROLES
                  </span>
                </div>
                <span className="font-mono text-xs text-[#78716C] tracking-wider hidden sm:inline">
                  OPEN FOR APPLICATIONS
                </span>
              </div>

              <div className="space-y-4">
                
                {/* Job 1 */}
                <article className="border border-[#D9CFC7] p-5 sm:p-6 bg-[#F9F8F6] hover:bg-[#EFE9E3]/40 transition-all space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-serif text-xl font-semibold text-[#1C1917]">
                          Senior Fullstack Developer (React &amp; Node.js)
                        </h3>
                        <span className="px-2 py-0.5 bg-[#C9B59C]/40 border border-[#8C7A6B]/30 text-[#1C1917] font-mono text-[10px] font-bold uppercase">
                          FinTech Startup
                        </span>
                      </div>
                      <p className="font-mono text-xs text-[#78716C] mt-1">
                        Jakarta · Hybrid (3 Days Remote) · Rp 22,000,000 – Rp 35,000,000 / month
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleActionToast('Opening application for Senior Fullstack Developer...')}
                      className="fm-btn fm-btn-primary self-start sm:self-auto text-xs py-1.5 px-3.5"
                    >
                      <span>Apply for Role</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed font-sans">
                    Develop and optimize digital banking web applications, integrate payment gateway APIs, and maintain high performance for high-traffic financial transactions.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px] text-[#78716C]">
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">React.js</span>
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">Node.js</span>
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">PostgreSQL</span>
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">Docker</span>
                  </div>
                </article>

                {/* Job 2 */}
                <article className="border border-[#D9CFC7] p-5 sm:p-6 bg-[#F9F8F6] hover:bg-[#EFE9E3]/40 transition-all space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-serif text-xl font-semibold text-[#1C1917]">
                          Backend Engineer (Golang &amp; Microservices)
                        </h3>
                        <span className="px-2 py-0.5 bg-[#1C1917] text-[#F9F8F6] font-mono text-[10px] font-bold uppercase">
                          100% Remote / WFH
                        </span>
                      </div>
                      <p className="font-mono text-xs text-[#78716C] mt-1">
                        Anywhere in Indonesia / APAC · E-Commerce Platform · Rp 18,000,000 – Rp 30,000,000 / month
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleActionToast('Opening application for Backend Engineer (Golang)...')}
                      className="fm-btn fm-btn-primary self-start sm:self-auto text-xs py-1.5 px-3.5"
                    >
                      <span>Apply for Role</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed font-sans">
                    Architect low-latency microservices, manage distributed database clusters, and implement scalable asynchronous message queuing systems with Kafka.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px] text-[#78716C]">
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">Golang</span>
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">RESTful API</span>
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">Redis</span>
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">Kafka</span>
                  </div>
                </article>

                {/* Job 3 */}
                <article className="border border-[#D9CFC7] p-5 sm:p-6 bg-[#F9F8F6] hover:bg-[#EFE9E3]/40 transition-all space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-serif text-xl font-semibold text-[#1C1917]">
                          UI/UX Product Designer
                        </h3>
                        <span className="px-2 py-0.5 bg-[#E8F0EA] text-[#2E5C38] border border-[#2E5C38]/40 font-mono text-[10px] font-bold uppercase">
                          Enterprise SaaS
                        </span>
                      </div>
                      <p className="font-mono text-xs text-[#78716C] mt-1">
                        Jakarta · Hybrid · Rp 14,000,000 – Rp 22,000,000 / month + MacBook Pro
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleActionToast('Opening application for UI/UX Product Designer...')}
                      className="fm-btn fm-btn-primary self-start sm:self-auto text-xs py-1.5 px-3.5"
                    >
                      <span>Apply for Role</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed font-sans">
                    Design intuitive user journeys, construct interactive prototypes in Figma, and build cohesive design systems for smooth developer handoffs.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px] text-[#78716C]">
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">Figma</span>
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">Design Systems</span>
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">User Research</span>
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">Wireframing</span>
                  </div>
                </article>

              </div>
            </section>

            {/* 4. RECRUITMENT DOMAINS */}
            <section className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-[#D9CFC7] pb-3">
                <h2 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-normal">
                  IT Disciplines I Specialize In
                </h2>
                <span className="font-mono text-xs text-[#78716C] tracking-wider">
                  SPECIALTIES
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
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

            {/* 5. RECRUITER CONTACT */}
            <section className="pt-8 sm:pt-10 border-t border-[#1C1917] text-center space-y-5" id="recruiter-contact">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1917] font-normal">
                Hiring Tech Talent or Looking for Your Next Opportunity?
              </h2>
              <p className="max-w-lg mx-auto text-xs sm:text-sm text-[#44403C] font-sans leading-relaxed">
                Contact me directly to discuss your engineering team's hiring roadmap, or send your CV to join our priority tech talent network.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs pt-2">
                <a
                  className="fm-btn fm-btn-primary px-6 py-2.5"
                  href={`mailto:${recruiterEmail}?subject=Tech%20Recruitment%20Consultation`}
                >
                  Submit Hiring Mandate (Email)
                </a>
                <button
                  type="button"
                  onClick={() => handleActionToast('Opening priority talent pool registration...')}
                  className="fm-btn px-6 py-2.5 bg-[#F9F8F6] border border-[#D9CFC7] hover:bg-[#EFE9E3] hover:border-[#1C1917] transition-all"
                >
                  Submit CV to Recruiter
                </button>
              </div>
            </section>
          </>
        ) : (
          /* ============================================================== */
          /* ================== VIEW 2: IT JOB SEEKER ===================== */
          /* ============================================================== */
          <>
            {/* 1. HERO IT JOB SEEKER */}
            <section className="space-y-8">
              <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-8 md:gap-12">
                
                {/* Biodata & Summary */}
                <div className="space-y-4 max-w-xl">
                  
                  {/* Status Badges */}
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-wider uppercase">
                    <span className="inline-flex items-center gap-1.5 text-[#8C7A6B]">
                      <Code size={13} />
                      IT Job Seeker Profile · {candidateRef}
                    </span>
                    <span className="text-[#D9CFC7]">|</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#E8F0EA] text-[#2E5C38] border border-[#2E5C38]/30 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2E5C38] animate-pulse" />
                      Open to Work (Full-Time / Remote)
                    </span>
                  </div>

                  <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1C1917] font-normal tracking-tight leading-[1.15]">
                    {candidateName}
                  </h1>

                  <p className="font-serif text-xl sm:text-2xl text-[#44403C] italic font-normal">
                    Senior Fullstack Developer &amp; UI/UX Specialist
                  </p>

                  <p className="text-sm sm:text-base text-[#1C1917] leading-relaxed font-sans pt-1">
                    Seasoned software engineer with 8+ years of hands-on experience developing modern web applications, resilient backend architectures, and polished user interfaces. Proficient with React, Node.js, and PostgreSQL. Currently seeking new Full-Time or Remote engineering opportunities.
                  </p>

                  {/* Actions */}
                  <div className="pt-3 flex flex-wrap items-center gap-3 font-mono text-xs">
                    <a
                      className="fm-btn fm-btn-primary px-5 py-2.5 inline-flex items-center gap-2"
                      href={`mailto:${candidateEmail}?subject=Job%20Opportunity%20Offer`}
                    >
                      <Mail size={14} />
                      <span>Get in Touch / Hire Me</span>
                      <ArrowRight size={14} />
                    </a>

                    <button
                      type="button"
                      onClick={handleDownloadCV}
                      className="fm-btn px-5 py-2.5 inline-flex items-center gap-2 bg-[#F9F8F6] border border-[#D9CFC7] hover:bg-[#EFE9E3] hover:border-[#1C1917] transition-all"
                    >
                      <Download size={14} />
                      <span>Download Full ATS Resume</span>
                    </button>
                  </div>
                </div>

                {/* Candidate Photo */}
                <div className="w-36 h-44 sm:w-44 sm:h-56 shrink-0 relative border border-[#D9CFC7] p-1.5 bg-[#F9F8F6] shadow-sm">
                  <img
                    alt={`${candidateName} IT Job Seeker`}
                    className="w-full h-full object-cover object-center filter contrast-[1.03]"
                    src="https://lh3.googleusercontent.com/aida/AEtjO1X-iRLH9b48sEiyxf8UuHRMNykeiNM1RSat9rTaLcbKxtSwrNfJVAoC1yC_rnJOsYiVblF-Plk8T-zQf3BrCF92mGgJSWvL8AtnMTTp0U1sOE0rDh649daVqlvJnAoH6Tn8eotzEiLoC86IP916_b5IrI5yzEzQtoen4afJN1sEl_PNPvEH79D_SxksDHXKYqwQaiIEK4IvhtSdmbmmL5Nym9z_DJQvJtC1WWobMVKZsdXQoWNDFLkzK6Y"
                  />
                  <div className="absolute bottom-2.5 right-2.5 bg-[#1C1917] text-[#F9F8F6] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider">
                    Active Tech Talent
                  </div>
                </div>
              </div>
            </section>

            {/* 2. TECHNICAL SKILLS SUMMARY */}
            <section className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-[#D9CFC7] pb-2">
                <h2 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-normal">
                  Technical Skills &amp; Stack
                </h2>
                <span className="font-mono text-xs text-[#78716C]">
                  CORE PROFICIENCIES
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
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

            {/* 3. WORK EXPERIENCE IN TECH */}
            <section className="space-y-6">
              <div className="flex items-baseline justify-between border-b border-[#D9CFC7] pb-3">
                <h2 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-normal">
                  Professional Work Experience
                </h2>
                <span className="font-mono text-xs text-[#78716C] tracking-wider">
                  2015 — PRESENT
                </span>
              </div>

              <div className="space-y-8">
                
                {/* Experience 1 */}
                <article className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#1C1917]">
                        Senior Fullstack Developer
                      </h3>
                      <span className="font-mono text-xs text-[#78716C]">
                        — PT Nusantara FinTek
                      </span>
                    </div>
                    <span className="font-mono text-xs text-[#44403C] shrink-0">
                      Nov 2021 — Present (Full-Time)
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed font-sans">
                    Architected and scaled digital banking web applications. Accelerated customer verification throughput by 150%, reduced page load times to under 1.5 seconds, and mentored a team of 6 engineers across sprint cycles.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px] text-[#78716C]">
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">React.js</span>
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">Node.js</span>
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">PostgreSQL</span>
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">Docker</span>
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">REST API</span>
                  </div>
                </article>

                {/* Experience 2 */}
                <article className="space-y-2 border-t border-[#D9CFC7]/50 pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#1C1917]">
                        Frontend Developer &amp; UI Lead
                      </h3>
                      <span className="font-mono text-xs text-[#78716C]">
                        — Tokopedia / GoTo Group
                      </span>
                    </div>
                    <span className="font-mono text-xs text-[#44403C] shrink-0">
                      Aug 2018 — Oct 2021
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed font-sans">
                    Built unified single-screen checkout and payment flows serving 40M+ monthly active users. Reduced checkout drop-off rates by 18% through automated voucher application and responsive UI enhancements.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px] text-[#78716C]">
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">JavaScript / TypeScript</span>
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">React</span>
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">Tailwind CSS</span>
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">Figma</span>
                  </div>
                </article>

                {/* Experience 3 */}
                <article className="space-y-2 border-t border-[#D9CFC7]/50 pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#1C1917]">
                        Web Developer &amp; UI Designer
                      </h3>
                      <span className="font-mono text-xs text-[#78716C]">
                        — Bukalapak
                      </span>
                    </div>
                    <span className="font-mono text-xs text-[#44403C] shrink-0">
                      May 2015 — Jul 2018
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed font-sans">
                    Designed and deployed responsive web interfaces for merchant sellers. Ensured optimal lightweight rendering across diverse mobile browsers and low-bandwidth connectivity regions.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px] text-[#78716C]">
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">HTML5 / CSS3</span>
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">JavaScript</span>
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">Responsive Design</span>
                    <span className="bg-[#EFE9E3] px-2 py-0.5 border border-[#D9CFC7]">Figma</span>
                  </div>
                </article>

              </div>
            </section>

            {/* 4. EDUCATION & CERTIFICATIONS */}
            <section className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-[#D9CFC7] pb-3">
                <h2 className="font-serif text-xl sm:text-2xl text-[#1C1917] font-normal">
                  Education &amp; Verified Certifications
                </h2>
                <span className="font-mono text-xs text-[#78716C] tracking-wider">
                  VERIFIED
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-[#D9CFC7]/40 gap-1">
                  <div>
                    <span className="font-semibold text-[#1C1917]">Institut Teknologi Bandung (ITB)</span>
                    <span className="text-[#44403C] ml-2">— B.Sc. &amp; M.Sc. in Informatics &amp; Computer Science</span>
                  </div>
                  <span className="text-[#78716C]">Magna Cum Laude Honors</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-[#D9CFC7]/40 gap-1">
                  <div>
                    <span className="font-semibold text-[#1C1917]">Google Cloud Certified</span>
                    <span className="text-[#44403C] ml-2">— Associate Cloud Engineer</span>
                  </div>
                  <span className="text-[#78716C]">Cloud Infrastructure &amp; Systems</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-[#D9CFC7]/40 gap-1">
                  <div>
                    <span className="font-semibold text-[#1C1917]">Meta Certified Professional</span>
                    <span className="text-[#44403C] ml-2">— Meta Frontend Developer Professional Certificate</span>
                  </div>
                  <span className="text-[#78716C]">React &amp; Web Systems</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 gap-1">
                  <div>
                    <span className="font-semibold text-[#1C1917]">Nielsen Norman Group (NN/g)</span>
                    <span className="text-[#44403C] ml-2">— Certified UX Master</span>
                  </div>
                  <span className="text-[#78716C]">UX Architecture &amp; Benchmarking</span>
                </div>
              </div>
            </section>

            {/* 5. JOB SEEKER CONTACT */}
            <section className="pt-8 sm:pt-10 border-t border-[#1C1917] text-center space-y-5" id="contact">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1917] font-normal">
                Interested in Adding Me to Your Tech Team?
              </h2>
              <p className="max-w-lg mx-auto text-xs sm:text-sm text-[#44403C] font-sans leading-relaxed">
                I am actively considering opportunities for Senior Developer, Tech Lead, or Fullstack Engineer positions. Let's start a conversation.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs pt-2">
                <a
                  className="fm-btn fm-btn-primary px-6 py-2.5"
                  href={`mailto:${candidateEmail}?subject=Tech%20Job%20Opportunity`}
                >
                  Send Job Opportunity (Email)
                </a>
                <button
                  type="button"
                  className="fm-btn px-6 py-2.5 bg-[#F9F8F6] border border-[#D9CFC7] hover:bg-[#EFE9E3] hover:border-[#1C1917] transition-all"
                  onClick={() => handleActionToast('Opening LinkedIn profile...')}
                >
                  View LinkedIn Profile
                </button>
              </div>
            </section>
          </>
        )}

      </main>
    </div>
  );
}
