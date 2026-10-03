import React, { useState } from 'react';
import { api } from '../services/api';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, Briefcase, Users, Building, ShieldCheck } from 'lucide-react';

export default function AuthView({ setUser, showToast }) {
  const [activeAuthTab, setActiveAuthTab] = useState('login');
  const [selectedUserRole, setSelectedUserRole] = useState('job_seeker');

  const [fullNameInput, setFullNameInput] = useState('');
  const [emailAddressInput, setEmailAddressInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState(null);
  const [authSuccessMessage, setAuthSuccessMessage] = useState(null);

  const resetFormFeedback = () => {
    setAuthErrorMessage(null);
    setAuthSuccessMessage(null);
  };

  const switchAuthTab = (targetTab) => {
    setActiveAuthTab(targetTab);
    resetFormFeedback();
  };

  const executeLoginFlow = async () => {
    const loginResult = await api.login(emailAddressInput, passwordInput);
    setUser(loginResult.data.user);
    if (showToast) {
      showToast('LOGIN BERHASIL! BERPINDAH KE HOMEPAGE');
    }
  };

  const executeRegisterFlow = async () => {
    const registrationResult = await api.register(
      fullNameInput,
      emailAddressInput,
      passwordInput,
      selectedUserRole
    );
    setAuthSuccessMessage(`${registrationResult.message || 'Registrasi berhasil!'} Silakan login dengan akun Anda.`);
    setActiveAuthTab('login');
    setPasswordInput('');
    if (showToast) {
      showToast('REGISTRASI BERHASIL! SILAKAN LOGIN');
    }
  };

  const handleAuthenticationSubmit = async (event) => {
    event.preventDefault();
    resetFormFeedback();
    setIsSubmittingAuth(true);

    try {
      if (activeAuthTab === 'login') {
        await executeLoginFlow();
      } else {
        await executeRegisterFlow();
      }
    } catch (submissionError) {
      setAuthErrorMessage(submissionError.message);
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  return (
    <div className="w-full bg-[#F9F8F6] min-h-[calc(100vh-160px)] flex flex-col justify-center py-8 sm:py-14 px-4 sm:px-6 lg:px-8">

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

        <div className="lg:col-span-6 space-y-6">

          <div className="space-y-2">
            <span className="font-mono text-xs text-[#78716c] font-bold uppercase tracking-widest block">
              FORCE MAJEURE
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1c1917] leading-tight">
              {activeAuthTab === 'login' ? 'Welcome to your professional community' : 'Join the executive career network'}
            </h1>
            <p className="font-serif italic text-sm sm:text-base text-[#57534e]">
              Kelola karir eksekutif, terhubung dengan talenta terbaik, dan buka peluang karir baru.
            </p>
          </div>

          <div className="bg-[#EFE9E3] border border-[#D9CFC7] p-6 sm:p-8 space-y-6 shadow-sm">

            <div className="flex border-b border-[#D9CFC7] font-mono text-xs">
              <button
                type="button"
                onClick={() => switchAuthTab('login')}
                className={`flex-1 py-3 text-center font-bold transition-all ${activeAuthTab === 'login' ? 'bg-[#C9B59C] text-[#1c1917] border-b-2 border-[#1c1917]' : 'text-[#57534e] hover:text-[#1c1917] bg-[#F9F8F6]'
                  }`}
              >
                SIGN IN (LOGIN)
              </button>
              <button
                type="button"
                onClick={() => switchAuthTab('register')}
                className={`flex-1 py-3 text-center font-bold transition-all ${activeAuthTab === 'register' ? 'bg-[#C9B59C] text-[#1c1917] border-b-2 border-[#1c1917]' : 'text-[#57534e] hover:text-[#1c1917] bg-[#F9F8F6]'
                  }`}
              >
                JOIN NOW (REGISTRASI)
              </button>
            </div>

            {authErrorMessage && (
              <div className="p-3 border border-red-500 bg-red-50 text-red-700 text-xs font-mono flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{authErrorMessage}</span>
              </div>
            )}

            {authSuccessMessage && (
              <div className="p-3 border border-emerald-600 bg-emerald-50 text-emerald-800 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{authSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleAuthenticationSubmit} className="space-y-5">

              {activeAuthTab === 'register' && (
                <>
                  <div className="font-mono text-xs">
                    <label className="text-[#78716c] font-bold block mb-1.5 uppercase">SELECT ROLE ACCOUNT</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedUserRole('job_seeker')}
                        className={`py-2.5 px-3 border text-center transition-all ${selectedUserRole === 'job_seeker'
                          ? 'border-[#C9B59C] bg-[#C9B59C] text-[#1c1917] font-bold'
                          : 'border-[#D9CFC7] bg-[#F9F8F6] text-[#57534e]'
                          }`}
                      >
                        JOB SEEKER
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedUserRole('recruiter')}
                        className={`py-2.5 px-3 border text-center transition-all ${selectedUserRole === 'recruiter'
                          ? 'border-[#C9B59C] bg-[#C9B59C] text-[#1c1917] font-bold'
                          : 'border-[#D9CFC7] bg-[#F9F8F6] text-[#57534e]'
                          }`}
                      >
                        RECRUITER
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-[#1c1917] block">NAMA LENGKAP</label>
                    <div className="relative flex items-center">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716c] pointer-events-none z-10" />
                      <input
                        type="text"
                        required
                        placeholder="Alex Vance"
                        value={fullNameInput}
                        onChange={(e) => setFullNameInput(e.target.value)}
                        className="fm-input fm-input-icon-left w-full pr-3"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#1c1917] block">EMAIL ADDRESS</label>
                <div className="relative flex items-center">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716c] pointer-events-none z-10" />
                  <input
                    type="email"
                    required
                    placeholder="alex@forcemajeure.bzh"
                    value={emailAddressInput}
                    onChange={(e) => setEmailAddressInput(e.target.value)}
                    className="fm-input fm-input-icon-left w-full pr-3"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono font-bold text-[#1c1917]">
                    PASSWORD {activeAuthTab === 'register' && <span className="text-[10px] text-[#78716c] font-normal">(Min. 6 Karakter)</span>}
                  </label>
                  {activeAuthTab === 'login' && (
                    <span className="text-[11px] font-mono text-[#57534e] hover:underline cursor-pointer">
                      Forgot password?
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716c] pointer-events-none z-10" />
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="••••••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="fm-input fm-input-icon-left fm-input-icon-right w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#78716c] hover:text-[#1c1917] p-1 flex items-center justify-center transition-colors z-10"
                  >
                    {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingAuth}
                className="fm-btn fm-btn-primary w-full justify-center py-3.5 mt-2 font-mono text-xs font-bold"
              >
                {isSubmittingAuth ? (
                  <span>PROCESSING AUTHENTICATION...</span>
                ) : (
                  <>
                    <span>{activeAuthTab === 'login' ? 'SIGN IN' : 'AGREE & JOIN NOW'}</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

            </form>

            <div className="text-center pt-3 border-t border-[#D9CFC7] font-mono text-xs text-[#57534e]">
              {activeAuthTab === 'login' ? (
                <p>
                  New to Force Majeure?{' '}
                  <button
                    type="button"
                    onClick={() => switchAuthTab('register')}
                    className="text-[#1c1917] font-bold underline hover:text-[#C9B59C]"
                  >
                    Join now
                  </button>
                </p>
              ) : (
                <p>
                  Already on Force Majeure?{' '}
                  <button
                    type="button"
                    onClick={() => switchAuthTab('login')}
                    className="text-[#1c1917] font-bold underline hover:text-[#C9B59C]"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>

          </div>

        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#EFE9E3] border border-[#D9CFC7] p-8 sm:p-10 space-y-6">

            <div className="space-y-3">
              <span className="font-mono text-xs text-[#78716c] font-bold uppercase tracking-widest block">
                EXECUTIVE COMMUNITY NETWORK
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1c1917]">
                Connect with top talent and leading recruiters
              </h2>
              <p className="font-serif italic text-sm text-[#57534e] leading-relaxed">
                Jaringan karir eksekutif terpercaya yang menghubungkan insinyur lunak, arsitek AI, perancang kreatif, dan perekrut global.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 font-mono text-xs pt-2">
              <div className="bg-[#F9F8F6] p-4 border border-[#D9CFC7] space-y-1">
                <div className="flex items-center gap-2 text-[#C9B59C]">
                  <Briefcase size={16} />
                  <span className="text-lg font-bold text-[#1c1917]">140+</span>
                </div>
                <span className="text-[10px] text-[#78716c] font-bold block uppercase">Active Positions</span>
              </div>

              <div className="bg-[#F9F8F6] p-4 border border-[#D9CFC7] space-y-1">
                <div className="flex items-center gap-2 text-[#C9B59C]">
                  <Users size={16} />
                  <span className="text-lg font-bold text-[#1c1917]">8.5k</span>
                </div>
                <span className="text-[10px] text-[#78716c] font-bold block uppercase">Registered Talent</span>
              </div>

              <div className="bg-[#F9F8F6] p-4 border border-[#D9CFC7] space-y-1">
                <div className="flex items-center gap-2 text-[#C9B59C]">
                  <Building size={16} />
                  <span className="text-lg font-bold text-[#1c1917]">95%</span>
                </div>
                <span className="text-[10px] text-[#78716c] font-bold block uppercase">Verified Studios</span>
              </div>

              <div className="bg-[#F9F8F6] p-4 border border-[#D9CFC7] space-y-1">
                <div className="flex items-center gap-2 text-[#C9B59C]">
                  <ShieldCheck size={16} />
                  <span className="text-lg font-bold text-[#1c1917]">99.2%</span>
                </div>
                <span className="text-[10px] text-[#78716c] font-bold block uppercase">Placement Rate</span>
              </div>
            </div>

            <div className="bg-[#F9F8F6] p-4 border-l-2 border-[#C9B59C] text-xs space-y-1 font-serif">
              <p className="italic text-[#1c1917]">
                "Platform tercepat untuk merekrut Senior Technologists dan AI Architects tanpa hambatan."
              </p>
              <span className="font-mono text-[10px] text-[#78716c] block font-bold uppercase">
                — Synthesis Neural Labs
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
