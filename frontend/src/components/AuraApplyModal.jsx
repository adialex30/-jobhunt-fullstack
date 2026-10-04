import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Send, CheckCircle2, ShieldCheck, Briefcase, AlertCircle, LogIn } from 'lucide-react';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';

export default function AuraApplyModal({ job, onClose, onConfirm }) {
  const [personalNote, setPersonalNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const { isLoggedIn, isJobSeeker } = useAuth();
  const navigate = useNavigate();

  if (!job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isLoggedIn) {
      setError('Anda harus masuk (login) sebagai Job Seeker terlebih dahulu untuk melamar pekerjaan ini.');
      return;
    }

    if (!isJobSeeker) {
      setError('Hanya akun dengan peran Job Seeker yang dapat mengajukan lamaran.');
      return;
    }

    try {
      setIsSubmitting(true);
      await applicationService.applyJob(job.id, { cover_letter: personalNote });
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        if (onConfirm) onConfirm(job.company);
        onClose();
      }, 1500);
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Gagal mengirimkan lamaran pekerjaan.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1c1917]/70 backdrop-blur-sm animate-in fade-in duration-150 font-mono text-xs">
      <div className="bg-[#F9F8F6] border border-[#D9CFC7] max-w-lg w-full p-4 sm:p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 text-[#78716c] hover:text-[#1c1917] transition-colors"
          aria-label="Tutup"
        >
          <X size={18} />
        </button>

        {success ? (
          <div className="text-center py-8 sm:py-10 space-y-3">
            <CheckCircle2 size={44} className="mx-auto text-emerald-700 animate-in zoom-in-50 duration-300" />
            <h3 className="font-heading text-xl font-bold text-[#1c1917]">
              Lamaran Berhasil Terkirim
            </h3>
            <p className="font-sans text-xs text-[#57534e] max-w-sm mx-auto leading-relaxed">
              Berkas dossier profil Anda telah diteruskan langsung ke tim rekrutmen <strong className="text-[#1c1917]">{job.company}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-[#6b5c47] mb-1">
                <Briefcase size={14} />
                <span className="text-[10px] uppercase tracking-widest font-semibold">
                  Kandidat Dispatch • POST /api/jobs/{job.id}/apply
                </span>
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#1c1917] leading-snug">
                Lamar ke {job.company}
              </h3>
              <p className="font-sans text-xs text-[#57534e] mt-0.5">
                Posisi: <span className="font-bold text-[#1c1917]">{job.title}</span>
              </p>
            </div>

            {error && (
              <div className="p-3 bg-[#ffdad6]/40 border border-[#ba1a1a] text-[#ba1a1a] flex items-start gap-2 text-[11px]">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span>{error}</span>
                  {!isLoggedIn && (
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          navigate('/login');
                        }}
                        className="font-bold underline flex items-center gap-1 mt-1 text-[#1c1917]"
                      >
                        <LogIn size={11} /> Masuk Sekarang
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-[#EFE9E3]/70 border border-[#D9CFC7] p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-[#1c1917] font-bold text-[11px]">
                <ShieldCheck size={14} className="text-[#6b5c47]" />
                <span>Kandidat Dossier Dispatch</span>
              </div>
              <p className="font-sans text-[11px] text-[#57534e] leading-relaxed">
                Resume, rekam jejak, dan surat pengantar Anda dilampirkan langsung ke panel dashboard recruiter lowongan ini.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1c1917] mb-1">
                Surat Pengantar / Cover Letter (Opsional)
              </label>
              <textarea
                rows={3}
                placeholder="Tuliskan catatan singkat kepada hiring team mengenai motivasi atau relevansi portofolio Anda..."
                value={personalNote}
                onChange={(e) => setPersonalNote(e.target.value)}
                className="fm-input w-full"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-[#D9CFC7]">
              <button
                type="button"
                onClick={onClose}
                className="fm-btn px-4 py-2 border-[#D9CFC7] bg-[#EFE9E3] text-[#57534e] hover:text-[#1c1917] justify-center"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="fm-btn fm-btn-primary px-6 py-2 flex items-center justify-center gap-2"
              >
                <Send size={13} />
                <span>{isSubmitting ? 'Mengirim...' : 'Kirim Lamaran'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
