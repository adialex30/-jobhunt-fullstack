import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Briefcase, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage({ showToast }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('job_seeker');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Semua field wajib diisi.');
      return;
    }

    if (password.length < 6) {
      setError('Kata sandi minimal harus 6 karakter.');
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role
      });

      if (showToast) {
        showToast('Registrasi berhasil! Silakan masuk dengan akun baru Anda.');
      }
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 font-mono text-xs">
      <div className="w-full max-w-md bg-[#F9F8F6] border border-[#D9CFC7] shadow-xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[#6b5c47] text-[10px] uppercase tracking-widest font-semibold">
            <UserPlus size={14} />
            <span>Pendaftaran Akun Baru</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-[#1c1917] tracking-tight">
            Buat Akun Anda
          </h2>
          <p className="font-serif italic text-xs text-[#57534e]">
            Pilih peran Anda untuk mulai melamar pekerjaan atau merekrut talenta.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-[#ffdad6]/40 border border-[#ba1a1a]/40 text-[#ba1a1a] flex items-start gap-2 text-[11px] animate-in fade-in">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1c1917] mb-1.5">
              Daftar Sebagai Peran:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('job_seeker')}
                className={`p-3 border text-left flex flex-col gap-1 transition-all ${
                  role === 'job_seeker'
                    ? 'border-[#1c1917] bg-[#EFE9E3] ring-1 ring-[#1c1917]'
                    : 'border-[#D9CFC7] bg-[#F9F8F6] opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1c1917]">Job Seeker</span>
                  {role === 'job_seeker' && <CheckCircle2 size={13} className="text-emerald-700" />}
                </div>
                <span className="text-[10px] text-[#57534e] font-sans">
                  Mencari dan melamar pekerjaan
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`p-3 border text-left flex flex-col gap-1 transition-all ${
                  role === 'recruiter'
                    ? 'border-[#1c1917] bg-[#EFE9E3] ring-1 ring-[#1c1917]'
                    : 'border-[#D9CFC7] bg-[#F9F8F6] opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1c1917]">Recruiter</span>
                  {role === 'recruiter' && <CheckCircle2 size={13} className="text-emerald-700" />}
                </div>
                <span className="text-[10px] text-[#57534e] font-sans">
                  Posting lowongan & seleksi pelamar
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1c1917] mb-1">
              Nama Lengkap
            </label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78716c]" />
              <input
                type="text"
                required
                placeholder="cth. Budi Pratama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="fm-input w-full pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1c1917] mb-1">
              Email
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78716c]" />
              <input
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="fm-input w-full pl-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1c1917] mb-1">
              Kata Sandi (Min. 6 Karakter)
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78716c]" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="fm-input w-full pl-9"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full fm-btn fm-btn-primary py-2.5 flex items-center justify-center gap-2 text-xs"
          >
            <UserPlus size={14} />
            <span>{isSubmitting ? 'Mendaftarkan...' : 'Selesaikan Pendaftaran'}</span>
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 text-[11px] text-[#57534e]">
          Sudah memiliki akun?{' '}
          <Link to="/login" className="font-bold text-[#1c1917] hover:underline inline-flex items-center gap-0.5">
            Masuk di sini <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  );
}
