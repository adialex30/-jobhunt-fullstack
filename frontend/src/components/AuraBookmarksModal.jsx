import React from 'react';
import { Bookmark, X, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AuraBookmarksModal({
  savedJobs = [],
  onClose,
  onSelectJob,
  onRemoveBookmark
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1c1917]/70 backdrop-blur-sm animate-in fade-in duration-150 font-mono text-xs">
      <div className="bg-[#F9F8F6] border border-[#D9CFC7] max-w-xl w-full p-4 sm:p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#D9CFC7]">
          <div className="flex items-center gap-2">
            <Bookmark size={18} className="fill-[#C9B59C] text-[#6b5c47]" />
            <h3 className="font-heading text-lg sm:text-xl font-bold text-[#1c1917]">
              Arsip Tersimpan ({savedJobs.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#78716c] hover:text-[#1c1917] transition-colors"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content List */}
        <div className="overflow-y-auto py-3 sm:py-4 space-y-2.5 flex-1">
          {savedJobs.length === 0 ? (
            <div className="text-center py-12 text-[#78716c] space-y-2">
              <Bookmark size={32} className="mx-auto text-[#D9CFC7]" />
              <p className="font-heading text-sm font-bold text-[#1c1917]">Belum ada lowongan tersimpan.</p>
              <p className="font-sans text-xs text-[#57534e]">Klik ikon bookmark pada kartu lowongan untuk menyimpannya.</p>
            </div>
          ) : (
            savedJobs.map((job) => (
              <div
                key={job.id}
                className="p-3 sm:p-3.5 bg-[#EFE9E3]/50 border border-[#D9CFC7] hover:border-[#1c1917] flex items-center justify-between gap-3 transition-colors"
              >
                <div
                  className="cursor-pointer flex-1 min-w-0"
                  onClick={() => {
                    if (onSelectJob) onSelectJob(job);
                    onClose();
                  }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b5c47] block truncate">
                    {job.company}
                  </span>
                  <h4 className="font-heading text-sm font-bold text-[#1c1917] hover:text-[#6b5c47] transition-colors truncate">
                    {job.title}
                  </h4>
                  <p className="font-sans text-[11px] text-[#78716c] truncate">
                    {job.location || 'Remote'} • {job.type || 'Full-Time'}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Link
                    to={`/jobs/${job.id}`}
                    onClick={onClose}
                    className="fm-btn fm-btn-primary px-3 py-1 text-[10px] flex items-center gap-1"
                  >
                    <span>Buka</span>
                    <ArrowRight size={10} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => onRemoveBookmark(job.id)}
                    className="p-1.5 text-[#78716c] hover:text-red-700 transition-colors"
                    title="Hapus dari arsip tersimpan"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#D9CFC7] text-center">
          <p className="font-sans text-[11px] text-[#78716c]">
            Daftar lowongan tersimpan disinkronkan secara lokal untuk peninjauan cepat.
          </p>
        </div>
      </div>
    </div>
  );
}
