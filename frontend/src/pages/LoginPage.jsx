import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ showToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/jobs';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email.trim() || !password.trim()) {
      setError('Email dan password wajib diisi.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await login(email.trim(), password);
      const userRole = res.data?.user?.role;

      if (showToast) {
        showToast(`Selamat datang kembali, ${res.data?.user?.name || 'Pengguna'}!`);
      }

      // Redirect recruiter to dashboard, job seeker to /jobs or requested path
      if (userRole === 'recruiter') {
        navigate('/dashboard');
      } else {
        navigate(redirectPath === '/login' ? '/jobs' : redirectPath);
      }
    } catch (err) {
      setError(err.message || 'Gagal masuk. Periksa kembali email dan password Anda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 font-mono text-xs">
      <div className="w-full max-w-md bg-[#F9F8F6] border border-[#D9CFC7] shadow-xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[#6b5c47] text-[10px] uppercase tracking-widest font-semibold">
            <ShieldCheck size={14} />
            <span>Autentikasi Pengguna</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-[#1c1917] tracking-tight">
            Masuk ke Akun
          </h2>
          <p className="font-serif italic text-xs text-[#57534e]">
            Akses riwayat lamaran Anda atau kelola kandidat lowongan.
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
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1c1917] mb-1">
              Email Perusahaan / Kandidat
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78716c]" />
              <input
                type="email"
                required
                placeholder="nama@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="fm-input w-full pl-9"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#1c1917]">
                Kata Sandi
              </label>
            </div>
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
            <LogIn size={14} />
            <span>{isSubmitting ? 'Memproses...' : 'Masuk ke Platform'}</span>
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="pt-4 border-t border-[#D9CFC7]/60 space-y-2">
          <span className="text-[10px] text-[#78716c] uppercase tracking-wider font-semibold block">
            Akun Percobaan (1-Klik Isi):
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => {
                setEmail('budi@example.com');
                setPassword('password123');
              }}
              className="p-2 border border-[#D9CFC7] bg-[#EFE9E3] hover:border-[#1c1917] text-left text-[#1c1917]"
            >
              <div className="font-bold">Job Seeker</div>
              <div className="text-[10px] text-[#78716c] truncate">budi@example.com</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail('recruiters@example.com');
                setPassword('password123');
              }}
              className="p-2 border border-[#D9CFC7] bg-[#EFE9E3] hover:border-[#1c1917] text-left text-[#1c1917]"
            >
              <div className="font-bold">Recruiter</div>
              <div className="text-[10px] text-[#78716c] truncate">recruiters@example.com</div>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center pt-2 text-[11px] text-[#57534e]">
          Belum memiliki akun?{' '}
          <Link to="/register" className="font-bold text-[#1c1917] hover:underline inline-flex items-center gap-0.5">
            Daftar Sekarang <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  );
}
