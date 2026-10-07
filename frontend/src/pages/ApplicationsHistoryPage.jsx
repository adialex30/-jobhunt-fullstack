import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApplications } from '../hooks/useApplications';
import { Briefcase, Building2, MapPin, Calendar, Clock, CheckCircle2, XCircle, AlertCircle, ArrowRight, FileText } from 'lucide-react';

export default function ApplicationsHistoryPage({ showToast }) {
  const { applications, loading, error, fetchMyApplications } = useApplications();

  useEffect(() => {
    fetchMyApplications();
  }, [fetchMyApplications]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'reviewed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 border border-blue-400 bg-blue-50 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
            <CheckCircle2 size={12} />
            <span>Reviewed</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 border border-red-400 bg-red-50 text-red-800 text-[10px] font-bold uppercase tracking-wider">
            <XCircle size={12} />
            <span>Rejected</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 border border-amber-400 bg-amber-50 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
            <Clock size={12} />
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-mono">

      <div className="mb-8 border-b border-[#D9CFC7] pb-6">
        <span className="text-[10px] font-bold text-[#78716c] uppercase tracking-widest block mb-1">
          CAREER &amp; APPLICATIONS
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1c1917] tracking-tight">
              My Applications
            </h1>
            <p className="text-xs text-[#57534e] mt-1">
              Track the review status of your submitted job applications.
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="py-20 text-center text-xs text-[#78716c] space-y-3">
          <div className="w-6 h-6 border-2 border-[#1c1917] border-t-transparent animate-spin mx-auto"></div>
          <p>Loading your application history...</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchMyApplications()}
            className="underline font-bold hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && applications.length === 0 && (
        <div className="bg-[#F9F8F6] border border-[#D9CFC7] p-10 sm:p-14 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#EFE9E3] border border-[#D9CFC7] flex items-center justify-center mx-auto text-[#78716c]">
            <FileText size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-lg font-bold text-[#1c1917]">
              No Applications Sent Yet
            </h3>
            <p className="text-xs text-[#57534e] max-w-md mx-auto">
              You haven't applied for any jobs yet. Discover open roles that match your skills.
            </p>
          </div>
          <Link
            to="/opportunities?tab=jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1c1917] text-[#F9F8F6] text-xs font-bold uppercase tracking-wider hover:bg-[#C9B59C] hover:text-[#1c1917] transition-all"
          >
            <span>Explore Opportunities</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {!loading && !error && applications.length > 0 && (
        <div className="space-y-4">
          <div className="text-xs text-[#78716c] font-bold">
            TOTAL: {applications.length} APPLICATIONS
          </div>

          <div className="grid grid-cols-1 gap-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-[#F9F8F6] border border-[#D9CFC7] p-5 sm:p-6 transition-all hover:border-[#1c1917] relative shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#D9CFC7]">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#6b5c47] text-xs uppercase tracking-wider">
                        {app.job?.company || app.job_company || 'Company'}
                      </span>
                      <span className="bg-[#EFE9E3] border border-[#D9CFC7] px-2 py-0.2 uppercase text-[9px] font-bold text-[#1c1917]">
                        {app.job?.type || app.job_type || 'Full-time'}
                      </span>
                    </div>
                    <h2 className="font-heading text-lg sm:text-xl font-bold text-[#1c1917]">
                      {app.job?.title || app.job_title || 'Job Role'}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#78716c]">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-[#6b5c47]" />
                        <span>{app.job?.location || app.job_location || 'Remote'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>
                          Applied on:{' '}
                          {app.applied_at
                            ? new Date(app.applied_at).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })
                            : '-'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                    <div className="text-[10px] uppercase text-[#78716c]">APPLICATION STATUS:</div>
                    {getStatusBadge(app.status)}
                  </div>
                </div>

                {app.cover_letter && (
                  <div className="mt-4 pt-3 text-xs text-[#57534e] bg-[#EFE9E3] p-3 border border-[#D9CFC7]">
                    <span className="font-bold text-[#1c1917] block mb-1">Cover Note:</span>
                    <p className="line-clamp-2 italic font-serif">"{app.cover_letter}"</p>
                  </div>
                )}

                <div className="mt-4 pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-[#78716c]">Application ID: #{app.id}</span>
                  <Link
                    to={`/jobs/${app.job_id || app.job?.id}`}
                    className="text-xs font-bold text-[#1c1917] hover:underline underline-offset-4 inline-flex items-center gap-1"
                  >
                    <span>View Job Details</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
