import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Download, CheckCircle2, XCircle, Clock, AlertCircle, RefreshCw, Mail, Calendar } from 'lucide-react';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';

export default function JobApplicantsPage({ showToast }) {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

  const loadApplicants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [jobRes, applicantsRes] = await Promise.all([
        jobService.getJobById(id).catch(() => null),
        applicationService.getJobApplicants(id)
      ]);

      if (jobRes?.data) {
        setJob(jobRes.data);
      }
      setApplicants(applicantsRes || []);
    } catch (err) {
      console.error('Error fetching job applicants:', err);
      setError(err.message || 'Failed to load applicants for this job opening.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadApplicants();
  }, [loadApplicants]);

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdatingId(applicationId);
    try {
      await applicationService.updateStatus(applicationId, newStatus);
      setApplicants((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app))
      );
      if (showToast) {
        showToast(`Applicant status updated to "${newStatus}"!`);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      if (showToast) {
        showToast(err.message || 'Failed to update applicant status.');
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportCSV = () => {
    if (applicants.length === 0) {
      if (showToast) showToast('No applicants to export.');
      return;
    }

    const headers = ['ID', 'Applicant Name', 'Applicant Email', 'Status', 'Date Applied', 'Cover Letter'];
    const rows = applicants.map((app) => [
      app.id,
      `"${app.applicant?.name || app.applicant_name || ''}"`,
      `"${app.applicant?.email || app.applicant_email || ''}"`,
      app.status,
      app.applied_at ? new Date(app.applied_at).toISOString() : '',
      `"${(app.cover_letter || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `applicants_job_${id}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (showToast) {
      showToast('Applicant list exported to CSV successfully.');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-mono">

      <div className="mb-8 border-b border-[#D9CFC7] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs text-[#78716c] hover:text-[#1c1917] transition-colors mb-2"
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1c1917]">
            Job Applicants
          </h1>
          <p className="text-xs text-[#57534e] mt-1">
            Role: <span className="font-bold text-[#1c1917]">{job?.title || `Job #${id}`}</span> — {job?.company || ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadApplicants}
            title="Reload"
            className="p-2 border border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917] hover:border-[#1c1917] transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={applicants.length === 0}
            className="px-4 py-2 border border-[#1c1917] bg-[#EFE9E3] text-[#1c1917] text-xs font-bold uppercase tracking-wider hover:bg-[#D9CFC7] transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
          <button onClick={loadApplicants} className="underline font-bold">
            Retry
          </button>
        </div>
      )}

      <div className="bg-[#F9F8F6] border border-[#D9CFC7]">
        <div className="px-5 py-4 border-b border-[#D9CFC7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-[#6b5c47]" />
            <h2 className="font-heading text-base font-bold text-[#1c1917]">
              Review Candidates
            </h2>
          </div>
          <span className="text-xs text-[#78716c] font-bold">
            {applicants.length} Total Applicants
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#78716c] space-y-2">
            <div className="w-5 h-5 border-2 border-[#1c1917] border-t-transparent animate-spin mx-auto"></div>
            <p>Loading applicants...</p>
          </div>
        ) : applicants.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users size={28} className="mx-auto text-[#78716c] opacity-50" />
            <p className="text-xs text-[#57534e]">
              No candidates have applied for this position yet.
            </p>
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EFE9E3] border-b border-[#D9CFC7] text-[#78716c] uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="px-5 py-3">Candidate Name &amp; Contact</th>
                    <th className="px-4 py-3">Cover Note</th>
                    <th className="px-4 py-3">Date Applied</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-5 py-3 text-right">Status Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9CFC7]">
                  {applicants.map((app) => (
                    <tr key={app.id} className="hover:bg-[#F2ECE6] transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-[#1c1917] text-sm">
                          {app.applicant?.name || app.applicant_name || 'Anonymous Candidate'}
                        </div>
                        <div className="text-[11px] text-[#57534e] flex items-center gap-1.5 mt-0.5">
                          <Mail size={12} className="text-[#78716c]" />
                          <span>{app.applicant?.email || app.applicant_email || '-'}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 max-w-xs">
                        {app.cover_letter ? (
                          <p className="line-clamp-2 italic text-[#57534e] font-serif text-[11px]">
                            "{app.cover_letter}"
                          </p>
                        ) : (
                          <span className="text-[#a8a29e] italic text-[11px]">
                            No cover note provided
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-[#78716c] whitespace-nowrap">
                        {app.applied_at
                          ? new Date(app.applied_at).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })
                          : '-'}
                      </td>

                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        {app.status === 'reviewed' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-blue-400 bg-blue-50 text-blue-800 text-[10px] font-bold uppercase">
                            <CheckCircle2 size={11} />
                            <span>Reviewed</span>
                          </span>
                        )}
                        {app.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-red-400 bg-red-50 text-red-800 text-[10px] font-bold uppercase">
                            <XCircle size={11} />
                            <span>Rejected</span>
                          </span>
                        )}
                        {app.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-amber-400 bg-amber-50 text-amber-800 text-[10px] font-bold uppercase">
                            <Clock size={11} />
                            <span>Pending</span>
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right whitespace-nowrap space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(app.id, 'reviewed')}
                          disabled={updatingId === app.id || app.status === 'reviewed'}
                          className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-40"
                          title="Mark as Reviewed"
                        >
                          Reviewed
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(app.id, 'rejected')}
                          disabled={updatingId === app.id || app.status === 'rejected'}
                          className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-40"
                          title="Reject Application"
                        >
                          Rejected
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(app.id, 'pending')}
                          disabled={updatingId === app.id || app.status === 'pending'}
                          className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 disabled:opacity-40"
                          title="Reset to Pending"
                        >
                          Pending
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (< md) */}
            <div className="block md:hidden divide-y divide-[#D9CFC7]">
              {applicants.map((app) => (
                <div key={app.id} className="p-4 space-y-3 bg-[#F9F8F6]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-heading font-bold text-base text-[#1c1917] leading-snug">
                        {app.applicant?.name || app.applicant_name || 'Anonymous Candidate'}
                      </h3>
                      <div className="text-xs text-[#57534e] flex items-center gap-1.5 mt-0.5">
                        <Mail size={12} className="text-[#78716c]" />
                        <span>{app.applicant?.email || app.applicant_email || '-'}</span>
                      </div>
                    </div>
                    <div>
                      {app.status === 'reviewed' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-blue-400 bg-blue-50 text-blue-800 text-[10px] font-bold uppercase">
                          <CheckCircle2 size={11} />
                          <span>Reviewed</span>
                        </span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-red-400 bg-red-50 text-red-800 text-[10px] font-bold uppercase">
                          <XCircle size={11} />
                          <span>Rejected</span>
                        </span>
                      )}
                      {app.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-amber-400 bg-amber-50 text-amber-800 text-[10px] font-bold uppercase">
                          <Clock size={11} />
                          <span>Pending</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {app.cover_letter && (
                    <div className="bg-[#EFE9E3]/70 border border-[#D9CFC7] p-2.5 text-xs text-[#57534e] font-serif italic">
                      "{app.cover_letter}"
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-[#78716c] pt-1">
                    <span>Applied: {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : '-'}</span>
                  </div>

                  <div className="pt-2 border-t border-[#D9CFC7]/60 grid grid-cols-3 gap-1.5 text-center">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(app.id, 'reviewed')}
                      disabled={updatingId === app.id || app.status === 'reviewed'}
                      className="py-1.5 text-[10px] font-bold uppercase tracking-wider border border-blue-300 bg-blue-50 text-blue-700 disabled:opacity-40"
                    >
                      Reviewed
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(app.id, 'rejected')}
                      disabled={updatingId === app.id || app.status === 'rejected'}
                      className="py-1.5 text-[10px] font-bold uppercase tracking-wider border border-red-300 bg-red-50 text-red-700 disabled:opacity-40"
                    >
                      Rejected
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(app.id, 'pending')}
                      disabled={updatingId === app.id || app.status === 'pending'}
                      className="py-1.5 text-[10px] font-bold uppercase tracking-wider border border-amber-300 bg-amber-50 text-amber-700 disabled:opacity-40"
                    >
                      Pending
                    </button>
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
