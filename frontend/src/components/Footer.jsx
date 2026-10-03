import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Footer({ showToast }) {
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (submissionEvent) => {
    submissionEvent.preventDefault();
    if (newsletterEmail) {
      if (showToast) showToast('SUBSCRIBED TO FORCE MAJEURE DISPATCH');
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#EFE9E3] border-t border-[#D9CFC7] pt-16 pb-12 overflow-hidden relative font-mono text-xs text-[#57534e]">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">

          <div className="md:col-span-5 space-y-3">
            <h2 className="font-heading text-3xl font-bold text-[#1c1917] tracking-tight">
              forcemajeure.bzh
            </h2>
            <p className="font-serif italic text-sm text-[#1c1917] max-w-sm leading-relaxed">
              An independent executive talent archive and career platform for technologists, designers, and creative directors worldwide.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[#1c1917] font-bold uppercase tracking-widest text-[11px] mb-4">ARCHIVE DIRECTORY</h4>
            <ul className="space-y-2 text-[#57534e]">
              <li><a href="#jobs" className="hover:text-[#1c1917] transition-colors flex items-center gap-1">Opportunities <ArrowUpRight size={12} /></a></li>
              <li><a href="#talent" className="hover:text-[#1c1917] transition-colors flex items-center gap-1">Talent Roster <ArrowUpRight size={12} /></a></li>
              <li><a href="#recruiter" className="hover:text-[#1c1917] transition-colors flex items-center gap-1">Recruiter Console <ArrowUpRight size={12} /></a></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="text-[#1c1917] font-bold uppercase tracking-widest text-[11px]">EXECUTIVE DISPATCH</h4>
            <p className="text-xs text-[#57534e] font-serif italic">
              Subscribe to receive updates when executive roles enter the archive.
            </p>
            <form onSubmit={handleSubscribe} className="relative flex items-center">
              <input
                type="email"
                required
                placeholder="your.email@company.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="fm-input w-full pr-12"
              />
              <button
                type="submit"
                className="absolute right-1 px-3 py-1 bg-[#C9B59C] text-[#1c1917] font-bold hover:bg-[#1c1917] hover:text-[#F9F8F6] transition-colors"
              >
                →
              </button>
            </form>
          </div>

        </div>

        <div className="pt-8 border-t border-[#D9CFC7] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#78716c] font-bold gap-4">
          <div>
            © 2026 FORCEMAJEURE.BZH. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#1c1917] cursor-pointer">PRIVACY</span>
            <span>/</span>
            <span className="hover:text-[#1c1917] cursor-pointer">TERMS</span>
            <span>/</span>
            <span className="hover:text-[#1c1917] cursor-pointer">DIAGNOSTICS</span>
          </div>
        </div>

      </div>

      <div className="hidden md:block absolute -bottom-6 left-1/2 -translate-x-1/2 pointer-events-none select-none opacity-[0.04] whitespace-nowrap font-heading text-[10vw] font-bold text-[#1c1917]">
        FORCE MAJEURE
      </div>

    </footer>
  );
}
