import React from 'react';

export default function AuraFooter({ onInquire }) {
  return (
    <footer className="w-full bg-surface-container border-t border-outline-variant py-space-2xl mt-margin-lg">
      <div className="max-w-[1360px] mx-auto px-gutter-lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-xl pb-space-xl border-b border-outline-variant">

          {/* Logo & Description */}
          <div className="md:col-span-5 flex flex-col gap-space-sm">
            <div className="flex items-center gap-space-sm">
              <img
                alt="Aura Talent Logo"
                className="h-7 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkkuBV4BwMdqsMLnq6TYdrxOT73AmmJAtaXYp62F_eJzPZ2wL7XUMVCP-jgn1hibX_Ez1oXSH3ZazNuZYdnKnyMBPeGL3QG9hJ5niti4Ctvzj9ju1TfBL3y1oxOGfudvuYSTOG5Iq5BG6UjuwdUzAtsIH6wPjPuCYFRB_mojv_O2J144T8wW8C3HYSMbeTXTzpmPyi9es6Bgm0RiIgGOxL_a-E2W0zZ1tqpBJJP2y_BqvlZV4FotZO"
              />
              <span className="font-headline-sm text-headline-sm text-primary">
                Aura Talent
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mt-space-xs">
              An elevated, literary career discovery platform curated for visionary leaders, directors, and discerning knowledge workers.
            </p>
          </div>

          {/* Discovery Links */}
          <div className="md:col-span-2 flex flex-col gap-space-xs">
            <span className="font-label-md text-label-md uppercase tracking-wider text-secondary mb-space-xs">
              Discovery
            </span>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#curated">
              Curated Roles
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#executive">
              Executive Opportunities
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#venture">
              Venture Backed
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#studios">
              Design Studios
            </a>
          </div>

          {/* Intelligence Links */}
          <div className="md:col-span-2 flex flex-col gap-space-xs">
            <span className="font-label-md text-label-md uppercase tracking-wider text-secondary mb-space-xs">
              Intelligence
            </span>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#benchmark">
              Salary Benchmark
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#compass">
              Career Compass
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#quarterly">
              Quarterly Index
            </a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#editorial">
              Editorial
            </a>
          </div>

          {/* Private Advisory */}
          <div className="md:col-span-3 flex flex-col gap-space-xs">
            <span className="font-label-md text-label-md uppercase tracking-wider text-secondary mb-space-xs">
              Private Advisory
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
              Confidential representation and bespoke matchmaking for senior practitioners.
            </p>
            <div className="flex items-center">
              <button
                onClick={onInquire}
                className="inline-flex items-center justify-center font-label-md text-label-md bg-primary text-on-primary px-space-md py-space-sm rounded-full hover:bg-surface-tint transition-colors cursor-pointer shadow-sm"
              >
                Inquire with Partners
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md text-on-surface-variant font-body-sm text-body-sm">
          <p>© 2025 Aura Talent Advisory Inc. Crafted with editorial discernment.</p>
          <div className="flex items-center gap-space-lg">
            <a className="hover:text-on-surface transition-colors" href="#privacy">
              Privacy Policy
            </a>
            <a className="hover:text-on-surface transition-colors" href="#terms">
              Terms of Discernment
            </a>
            <a className="hover:text-on-surface transition-colors" href="#code">
              Code of Conduct
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
