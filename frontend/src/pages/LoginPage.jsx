import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ showToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn, isRecruiter } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  React.useEffect(() => {
    if (isLoggedIn) {
      const destination = location.state?.from?.pathname || (isRecruiter ? '/dashboard' : '/opportunities?tab=jobs');
      navigate(destination, { replace: true });
    }
  }, [isLoggedIn, isRecruiter, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

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

    setIsSubmitting(true);
    try {
      const res = await login(email.trim(), password);
      if (showToast) {
        showToast('Signed in successfully! Welcome back.');
      }
      const userRole = res.data?.user?.role;
      const redirectPath = location.state?.from?.pathname || (userRole === 'recruiter' ? '/dashboard' : '/opportunities?tab=jobs');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Incorrect email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#faf9f7] min-h-[calc(100vh-140px)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-mono">
      <div className="max-w-md w-full mx-auto space-y-6">
        
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold text-[#78716c] uppercase tracking-widest block">
            ACCOUNT ACCESS
          </span>
          <h1 className="font-heading text-3xl font-bold text-[#1c1917] tracking-tight">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-[#57534e]">
            Access job openings, track your applications, or manage candidate talent.
          </p>
        </div>

        <div className="bg-[#F9F8F6] border border-[#D9CFC7] p-6 sm:p-8 shadow-sm">
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  autoComplete="current-password"
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 bg-[#1c1917] hover:bg-[#C9B59C] hover:text-[#1c1917] text-[#F9F8F6] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#D9CFC7] text-center text-xs text-[#57534e]">
            <span>Don't have an account yet? </span>
            <Link
              to="/register"
              className="font-bold text-[#1c1917] hover:underline underline-offset-4"
            >
              Sign up here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
