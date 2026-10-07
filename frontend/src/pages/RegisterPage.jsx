import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, Briefcase, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage({ showToast }) {
  const navigate = useNavigate();
  const { register, isLoggedIn } = useAuth();

  const [role, setRole] = useState('job_seeker');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  React.useEffect(() => {
    if (isLoggedIn) {
      navigate('/opportunities?tab=jobs', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name || !name.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }

    if (!email || !email.trim()) {
      setErrorMessage('Email address is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Password is required.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password, role);
      setSuccessMessage('Account created successfully! Please sign in with your new account.');
      if (showToast) {
        showToast('Registration successful! Please sign in.');
      }
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#faf9f7] min-h-[calc(100vh-140px)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-mono">
      <div className="max-w-md w-full mx-auto space-y-6">

        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold text-[#78716c] uppercase tracking-widest block">
            CREATE ACCOUNT
          </span>
          <h1 className="font-heading text-3xl font-bold text-[#1c1917] tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs text-[#57534e]">
            Choose your role and join thousands of professional talents & recruiters.
          </p>
        </div>

        <div className="bg-[#F9F8F6] border border-[#D9CFC7] p-6 sm:p-8 shadow-sm">
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="mb-5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1c1917] mb-2">
              Register As (Role)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('job_seeker')}
                className={`p-3 border text-left flex flex-col gap-1 transition-all ${role === 'job_seeker'
                  ? 'border-[#1c1917] bg-[#C9B59C] text-[#1c1917] font-bold'
                  : 'border-[#D9CFC7] bg-[#EFE9E3] text-[#57534e] hover:border-[#1c1917]'
                  }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <Briefcase size={14} />
                  <span>Job Seeker</span>
                </div>
                <span className="text-[10px] opacity-80">Looking for a job</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`p-3 border text-left flex flex-col gap-1 transition-all ${role === 'recruiter'
                  ? 'border-[#1c1917] bg-[#C9B59C] text-[#1c1917] font-bold'
                  : 'border-[#D9CFC7] bg-[#EFE9E3] text-[#57534e] hover:border-[#1c1917]'
                  }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <Building size={14} />
                  <span>Recruiter</span>
                </div>
                <span className="text-[10px] opacity-80">Hiring tech talent</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1c1917] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#78716c]">
                  <User size={14} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full pl-9 pr-3 py-2 bg-[#EFE9E3] border border-[#D9CFC7] focus:border-[#1c1917] focus:bg-[#FAF9F7] text-xs outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1c1917] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#78716c]">
                  <Mail size={14} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  className="w-full pl-9 pr-3 py-2 bg-[#EFE9E3] border border-[#D9CFC7] focus:border-[#1c1917] focus:bg-[#FAF9F7] text-xs outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1c1917] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#78716c]">
                  <Lock size={14} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  className="w-full pl-9 pr-10 py-2 bg-[#EFE9E3] border border-[#D9CFC7] focus:border-[#1c1917] focus:bg-[#FAF9F7] text-xs outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#78716c] hover:text-[#1c1917]"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1c1917] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#78716c]">
                  <Lock size={14} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  className="w-full pl-9 pr-3 py-2 bg-[#EFE9E3] border border-[#D9CFC7] focus:border-[#1c1917] focus:bg-[#FAF9F7] text-xs outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 bg-[#1c1917] hover:bg-[#C9B59C] hover:text-[#1c1917] text-[#F9F8F6] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#D9CFC7] text-center text-xs text-[#57534e]">
            <span>Already have an account? </span>
            <Link
              to="/login"
              className="font-bold text-[#1c1917] hover:underline underline-offset-4"
            >
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
