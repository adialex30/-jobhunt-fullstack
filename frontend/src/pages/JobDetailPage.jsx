import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Briefcase, Calendar, DollarSign, Send, CheckCircle2, Bookmark, Share2, Edit2, Trash2 } from 'lucide-react';
import { jobService } from '../services/jobService';

export default function JobDetailPage({ onApply, onEditJob, savedJobIds = [], onToggleBookmark, showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await jobService.getJobById(id);
        if (res && res.data) {
          setJob(res.data);
        } else {
          setError('Data lowongan tidak ditemukan.');
        }
      } catch (err) {
        console.error('Error fetching job detail:', err);
        setError('Lowongan pekerjaan tidak ditemukan atau server mengalami gangguan.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Gaji Dirahasiakan / Kompetitif';
    const fmt = (num) => `Rp ${(num / 1000000).toFixed(0)} Juta`;
    if (min && max) return `${fmt(min)} – ${fmt(max)} / bulan`;
    if (min) return `Mulai ${fmt(min)} / bulan`;
    return `Hingga ${fmt(max)} / bulan`;
  };

  const isSaved = job ? savedJobIds.includes(String(job.id)) : false;

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-24 text-center font-mono text-xs text-[#78716c]">
        Memuat detail lowongan pekerjaan...
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-20 text-center font-mono">
        <p className="font-heading text-xl font-bold text-[#ba1a1a] mb-4">
          {error || 'Lowongan tidak ditemukan'}
        </p>
        <Link
          to="/jobs"
          className="fm-btn fm-btn-primary px-5 py-2 text-xs inline-flex items-center gap-2"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Katalog Lowongan</span>
        </Link>
      </div>
    );
  }

  const handleDeleteJob = async () => {
    if (!window.confirm(`Hapus lowongan "${job.title}" secara permanen?`)) return;
    try {
      await jobService.deleteJob(job.id);
      if (showToast) showToast('Lowongan berhasil dihapus dari database.');
      navigate('/jobs');
    } catch (err) {
      console.error('Error deleting job:', err);
      if (showToast) showToast(err.message || 'Gagal menghapus lowongan.');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-mono">
      {/* Back Link & Admin Actions */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-xs text-[#78716c] hover:text-[#1c1917] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Katalog Lowongan</span>
        </Link>

        {onEditJob && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => onEditJob(job)}
              className="fm-btn px-3 py-1.5 border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917] hover:border-[#1c1917] flex items-center gap-1.5 text-xs"
            >
              <Edit2 size={12} />
              <span>Edit (PUT)</span>
            </button>
            <button
              type="button"
              onClick={handleDeleteJob}
              className="fm-btn px-3 py-1.5 border-red-300 bg-red-50 text-red-700 hover:bg-red-100 flex items-center gap-1.5 text-xs"
            >
              <Trash2 size={12} />
              <span>Hapus (DELETE)</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Job Card */}
      <article className="bg-[#F9F8F6] border border-[#D9CFC7] p-4 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
        {/* Header Info */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 sm:pb-8 border-b border-[#D9CFC7]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-bold text-[#6b5c47] text-sm uppercase tracking-wider">
                {job.company}
              </span>
              <span className="bg-[#EFE9E3] border border-[#D9CFC7] px-2.5 py-0.5 uppercase text-[10px] font-bold text-[#1c1917]">
                {job.type}
              </span>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1c1917] tracking-tight leading-tight">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#78716c] pt-1">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-[#6b5c47] shrink-0" />
                <span>{job.location || 'Remote'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign size={14} className="text-[#6b5c47] shrink-0" />
                <span className="font-bold text-[#1c1917]">{formatSalary(job.salary_min, job.salary_max)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-[#6b5c47] shrink-0" />
                <span>{new Date(job.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
            <button
              type="button"
              onClick={(e) => onToggleBookmark && onToggleBookmark(e, String(job.id))}
              className="fm-btn p-2.5 border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917] hover:border-[#1c1917] shrink-0"
              aria-label="Simpan posisi"
            >
              <Bookmark size={16} className={isSaved ? 'fill-[#C9B59C] text-[#6b5c47]' : ''} />
            </button>

            <button
              type="button"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  if (showToast) showToast('Tautan lowongan disalin ke clipboard!');
                }
              }}
              className="fm-btn p-2.5 border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917] hover:border-[#1c1917] shrink-0"
              aria-label="Bagikan"
            >
              <Share2 size={16} />
            </button>

            <button
              type="button"
              onClick={() => onApply && onApply(job)}
              className="fm-btn fm-btn-primary px-5 sm:px-6 py-2.5 text-xs flex-1 lg:flex-initial flex items-center justify-center gap-2 shadow-md hover:translate-x-0.5 transition-transform"
            >
              <Send size={14} />
              <span>Lamar Sekarang</span>
            </button>
          </div>
        </div>

        {/* Content Body: Deskripsi & Kualifikasi */}
        <div className="py-8 space-y-8">
          {/* Deskripsi */}
          <div>
            <h2 className="font-heading text-xl font-bold text-[#1c1917] tracking-tight mb-3">
              Deskripsi Pekerjaan
            </h2>
            <div className="font-sans text-sm sm:text-base text-[#57534e] leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </div>

          {/* Kualifikasi */}
          {job.requirements && (
            <div>
              <h2 className="font-heading text-xl font-bold text-[#1c1917] tracking-tight mb-3">
                Kualifikasi & Persyaratan
              </h2>
              <div className="font-sans text-sm sm:text-base text-[#57534e] leading-relaxed whitespace-pre-line bg-[#EFE9E3]/50 border border-[#D9CFC7] p-5">
                {job.requirements}
              </div>
            </div>
          )}

          {/* Informasi Recruiter & Verifikasi */}
          <div className="pt-6 border-t border-[#D9CFC7] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#78716c]">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#6b5c47]" />
              <span>
                Dipublikasikan oleh <strong>{job.recruiter_name || 'Verified Recruiter'}</strong> ({job.recruiter_email || 'partner@forcemajeure.bzh'})
              </span>
            </div>
            <span>Status: Lowongan Masih Aktif</span>
          </div>
        </div>

        {/* Sticky/Bottom Apply Bar */}
        <div className="mt-6 pt-6 border-t border-[#D9CFC7] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#EFE9E3] p-4 sm:p-5">
          <div>
            <span className="text-[11px] text-[#78716c] uppercase tracking-wider block">
              Tertarik dengan posisi ini?
            </span>
            <span className="font-heading font-bold text-sm text-[#1c1917]">
              {job.title} di {job.company}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onApply && onApply(job)}
            className="w-full sm:w-auto fm-btn fm-btn-primary px-8 py-3 text-xs flex items-center justify-center gap-2 shadow-md"
          >
            <Send size={14} />
            <span>Lamar Sekarang</span>
          </button>
        </div>
      </article>
    </div>
  );
}
