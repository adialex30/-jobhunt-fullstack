import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Briefcase, Plus, Edit2, Trash2, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { jobService } from '../services/jobService';

export default function RecruiterJobsModal({
  isOpen,
  onClose,
  onOpenCreateJob,
  onEditJob,
  showToast
}) {
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const res = await jobService.getMyJobs();
      if (res && res.data) {
        setMyJobs(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error('Error fetching recruiter jobs:', err);
      if (showToast) showToast('Gagal memuat daftar lowongan recruiter.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMyJobs();
    }
  }, [isOpen]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus lowongan "${title}"?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await jobService.deleteJob(id);
      if (showToast) showToast(`Lowongan "${title}" berhasil dihapus.`);
      setMyJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      console.error('Error deleting job:', err);
      if (showToast) showToast(err.message || 'Gagal menghapus lowongan.');
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1c1917]/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#F9F8F6] border border-[#D9CFC7] max-w-4xl w-full p-4 sm:p-6 md:p-8 shadow-2xl relative max-h-[90vh] flex flex-col font-mono text-xs">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 text-[#78716c] hover:text-[#1c1917] transition-colors"
          aria-label="Tutup"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-[#D9CFC7] pr-8 sm:pr-0">
          <div>
            <div className="flex items-center gap-2 text-[#6b5c47] mb-1">
              <Briefcase size={16} />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold">
                Recruiter Job Management • GET /api/jobs/mine
              </span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#1c1917] tracking-tight">
              Daftar Lowongan yang Anda Kelola
            </h2>
            <p className="font-sans text-xs text-[#57534e] mt-0.5">
              Pantau, perbarui (PUT), atau hapus (DELETE) lowongan pekerjaan milik Anda sendiri.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1 sm:pt-0">
            <button
              onClick={() => {
                onClose();
                onOpenCreateJob();
              }}
              // className="fm-btn fm-btn-primary px-3 py-1.5 text-[11px] flex items-center gap-1.5 w-full sm:w-auto justify-center"
              className="fm-btn fm-btn-primary px-3 py-1.5 text-[11px] flex items-center gap-1.5 w-full sm:w-auto justify-center relative top-10"
            >
              <Plus size={13} />
              <span>Lowongan Baru</span>
            </button>
          </div>
        </div>

        {/* Content Table / List */}
        <div className="overflow-y-auto flex-1 my-4 divide-y divide-[#D9CFC7]/60">
          {loading ? (
            <div className="py-16 text-center text-[#78716c] flex items-center justify-center gap-2">
              <RefreshCw size={14} className="animate-spin" />
              <span>Memuat lowongan recruiter dari server...</span>
            </div>
          ) : myJobs.length === 0 ? (
            <div className="py-16 text-center text-[#78716c] space-y-3">
              <AlertCircle size={32} className="mx-auto text-[#6b5c47]" />
              <p className="font-heading text-base font-bold text-[#1c1917]">
                Belum ada lowongan yang diposting oleh akun Anda.
              </p>
              <p className="font-sans text-xs text-[#57534e] max-w-sm mx-auto">
                Mulai pasang lowongan pertama Anda untuk menarik talent terbaik di bidang desain, AI, dan engineering.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCreateJob();
                }}
                className="fm-btn fm-btn-primary px-4 py-2 mt-2"
              >
                Pasang Lowongan Sekarang
              </button>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {myJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 bg-[#EFE9E3]/40 border border-[#D9CFC7] hover:border-[#1c1917] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#6b5c47] uppercase text-[10px]">
                        {job.company}
                      </span>
                      <span className="bg-[#EFE9E3] border border-[#D9CFC7] px-2 py-0.2 uppercase text-[9px] font-bold text-[#1c1917]">
                        {job.type}
                      </span>
                      <span className="text-[10px] text-[#78716c]">
                        {job.location || 'Remote'}
                      </span>
                    </div>

                    <h3 className="font-heading text-base font-bold text-[#1c1917] truncate">
                      {job.title}
                    </h3>

                    <p className="font-sans text-[11px] text-[#57534e] line-clamp-1">
                      {job.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#D9CFC7] w-full sm:w-auto">
                    <Link
                      to={`/jobs/${job.id}`}
                      onClick={onClose}
                      className="fm-btn p-2 border-[#D9CFC7] bg-[#F9F8F6] text-[#57534e] hover:text-[#1c1917]"
                      title="Lihat Detail Publik"
                    >
                      <ExternalLink size={13} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onEditJob(job);
                      }}
                      className="fm-btn px-3 py-1.5 border-[#D9CFC7] bg-[#F9F8F6] text-[#1c1917] hover:border-[#1c1917] flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
                    >
                      <Edit2 size={12} />
                      <span>Edit (PUT)</span>
                    </button>

                    <button
                      type="button"
                      disabled={deletingId === job.id}
                      onClick={() => handleDelete(job.id, job.title)}
                      className="fm-btn px-3 py-1.5 border-red-300 bg-red-50 text-red-700 hover:bg-red-100 flex items-center justify-center gap-1.5 disabled:opacity-50 flex-1 sm:flex-initial"
                    >
                      <Trash2 size={12} />
                      <span>{deletingId === job.id ? '...' : 'Hapus (DELETE)'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-[#D9CFC7] flex items-center justify-between text-[11px] text-[#78716c]">
          <span>Total lowongan Anda: {myJobs.length}</span>
          <button
            type="button"
            onClick={fetchMyJobs}
            className="hover:text-[#1c1917] flex items-center gap-1"
          >
            <RefreshCw size={11} />
            <span>Segarkan Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
