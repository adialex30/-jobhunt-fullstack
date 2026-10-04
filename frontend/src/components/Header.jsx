import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bookmark,
  PlusCircle,
  Bell,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  FileText,
  Briefcase,
  LayoutDashboard,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({
  savedJobsCount = 0,
  onOpenSaved,
  showToast
}) {
  const { user, isLoggedIn, isJobSeeker, isRecruiter, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hasUnreadNotif, setHasUnreadNotif] = useState(true);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      title: 'Kinetic Spatial Labs update',
      desc: 'Principal Product Designer opening matched 98% with your profile.',
      time: '12m ago'
    },
    {
      id: 2,
      title: 'Issue Nº 42 Published',
      desc: 'Bespoke Advisory Index for Q2 is now open for review.',
      time: '2h ago'
    }
  ];

  return (
    <header className="w-full bg-[#F9F8F6] border-b border-[#D9CFC7] sticky top-0 z-40 backdrop-blur-md bg-opacity-95 transition-all">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 font-mono">

        {/* Brand & Live Archive Status */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="flex flex-col group">
            <span className="font-heading text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#1c1917] leading-none group-hover:text-[#6b5c47] transition-colors">
              forcemajeure.bzh
            </span>
            <span className="hidden sm:block text-[9px] sm:text-[10px] text-[#78716c] uppercase tracking-widest mt-1">
              CURATED EXECUTIVE & TECH ARCHIVE
            </span>
          </Link>

          <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 border border-[#D9CFC7] bg-[#EFE9E3] text-[10px] text-[#57534e]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>INDEX ACTIVE</span>
          </div>
        </div>

        {/* Center / Navigation Links */}
        <nav className="hidden md:flex items-center gap-4 text-xs font-bold">
          {!isRecruiter && (
            <Link
              to="/jobs"
              className="hover:text-[#6b5c47] text-[#1c1917] transition-colors uppercase tracking-wider"
            >
              Katalog Lowongan
            </Link>
          )}

          {isJobSeeker && (
            <Link
              to="/applications"
              className="hover:text-[#6b5c47] text-[#1c1917] transition-colors uppercase tracking-wider"
            >
              Lamaran Saya
            </Link>
          )}

          {isRecruiter && (
            <>
              <Link
                to="/dashboard"
                className="hover:text-[#6b5c47] text-[#1c1917] transition-colors uppercase tracking-wider flex items-center gap-1"
              >
                <LayoutDashboard size={13} />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/jobs/create"
                className="hover:text-[#6b5c47] text-[#1c1917] transition-colors uppercase tracking-wider flex items-center gap-1"
              >
                <PlusCircle size={13} />
                <span>Buat Lowongan</span>
              </Link>
            </>
          )}
        </nav>

        {/* Right Section: Saved + Auth buttons + Profile */}
        <div className="flex items-center gap-1.5 sm:gap-3 text-xs ml-auto">

          {/* Clock (Desktop) */}
          <div className="hidden xl:block text-[11px] text-[#78716c] border-r border-[#D9CFC7] pr-3">
            {currentTime}
          </div>

          {/* Saved Jobs Button (Disembunyikan untuk Recruiter) */}
          {!isRecruiter && (
            <button
              type="button"
              onClick={onOpenSaved}
              className="fm-btn py-1.5 px-2.5 sm:px-3 text-[11px] flex items-center gap-1.5 border-[#D9CFC7] hover:border-[#1c1917] bg-[#EFE9E3] text-[#1c1917]"
              title="Daftar Lowongan Tersimpan"
            >
              <Bookmark
                size={13}
                className={savedJobsCount > 0 ? "fill-[#C9B59C] text-[#6b5c47]" : "text-[#57534e]"}
              />
              <span className="hidden sm:inline">SAVED</span>
              {savedJobsCount > 0 && (
                <span className="bg-[#C9B59C] text-[#1c1917] font-bold px-1.5 py-0.2 text-[10px] ml-0.5">
                  {savedJobsCount}
                </span>
              )}
            </button>
          )}

          {isLoggedIn ? (
            <>
              {/* Notifications Popover */}
              <div className="relative hidden sm:block" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsNotifOpen(!isNotifOpen);
                    setHasUnreadNotif(false);
                  }}
                  aria-label="Notifications"
                  className={`p-2 border transition-colors relative ${isNotifOpen
                    ? 'border-[#1c1917] bg-[#EFE9E3] text-[#1c1917]'
                    : 'border-[#D9CFC7] bg-[#EFE9E3] text-[#57534e] hover:border-[#1c1917] hover:text-[#1c1917]'
                    }`}
                >
                  <Bell size={14} />
                  {hasUnreadNotif && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a]" />
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 bg-[#F9F8F6] border border-[#D9CFC7] shadow-xl p-3 z-50 animate-in fade-in duration-100">
                    <div className="flex items-center justify-between pb-2 border-b border-[#D9CFC7] mb-2">
                      <span className="font-heading text-xs font-bold text-[#1c1917] uppercase tracking-wider">
                        Archive Dispatches
                      </span>
                    </div>
                    <div className="divide-y divide-[#D9CFC7]/50 max-h-60 overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n.id} className="py-2 hover:bg-[#EFE9E3] px-1 transition-colors">
                          <span className="font-bold text-[#1c1917] block text-[11px]">{n.title}</span>
                          <p className="text-[10px] font-sans text-[#57534e]">{n.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1.5 p-1 border border-[#D9CFC7] hover:border-[#1c1917] bg-[#EFE9E3] transition-all"
                  aria-label="User Profile"
                >
                  <div className="w-6 h-6 bg-[#1c1917] text-[#F9F8F6] flex items-center justify-center font-bold text-[10px]">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline text-[11px] font-bold text-[#1c1917] max-w-[120px] truncate">
                    {user?.name || 'Profil'}
                  </span>
                  <ChevronDown size={11} className="text-[#78716c]" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#F9F8F6] border border-[#D9CFC7] shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="pb-3 border-b border-[#D9CFC7]">
                      <div className="font-bold text-[#1c1917] truncate text-xs">{user?.name}</div>
                      <div className="text-[10px] text-[#78716c] truncate">{user?.email}</div>
                      <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#EFE9E3] text-[#6b5c47] border border-[#D9CFC7]">
                        {user?.role}
                      </span>
                    </div>

                    <div className="py-2 flex flex-col gap-1 text-[11px]">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 p-1.5 hover:bg-[#EFE9E3] text-[#1c1917] text-left transition-colors"
                      >
                        <User size={13} className="text-[#6b5c47]" />
                        <span>Profil Saya</span>
                      </Link>

                      {isJobSeeker && (
                        <Link
                          to="/applications"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 p-1.5 hover:bg-[#EFE9E3] text-[#1c1917] text-left transition-colors"
                        >
                          <FileText size={13} className="text-[#6b5c47]" />
                          <span>Riwayat Lamaran</span>
                        </Link>
                      )}

                      {isRecruiter && (
                        <>
                          <Link
                            to="/dashboard"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2 p-1.5 hover:bg-[#EFE9E3] text-[#1c1917] text-left transition-colors"
                          >
                            <LayoutDashboard size={13} className="text-[#6b5c47]" />
                            <span>Dashboard Recruiter</span>
                          </Link>
                          <Link
                            to="/jobs/create"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2 p-1.5 hover:bg-[#EFE9E3] text-[#1c1917] text-left transition-colors font-bold text-[#6b5c47]"
                          >
                            <PlusCircle size={13} className="text-[#6b5c47]" />
                            <span>Posting Lowongan</span>
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#D9CFC7]">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                          if (showToast) showToast('Anda telah keluar dari sistem.');
                          navigate('/login');
                        }}
                        className="w-full flex items-center justify-between p-1.5 text-[11px] text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors"
                      >
                        <span>Keluar (Sign Out)</span>
                        <LogOut size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* When NOT logged in: Show Masuk & Daftar */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="fm-btn py-1.5 px-3 text-[11px] flex items-center gap-1 border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917]"
              >
                <LogIn size={12} />
                <span>MASUK</span>
              </Link>
              <Link
                to="/register"
                className="fm-btn fm-btn-primary py-1.5 px-3 text-[11px] flex items-center gap-1"
              >
                <UserPlus size={12} />
                <span>DAFTAR</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 border border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917] hover:border-[#1c1917]"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Menu & Quick Actions) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#D9CFC7] bg-[#F9F8F6] px-4 py-4 space-y-3 font-mono text-xs">
          <div className="flex flex-col gap-2">
            {!isRecruiter && (
              <Link
                to="/jobs"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 border border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917]"
              >
                Katalog Lowongan
              </Link>
            )}

            {isJobSeeker && (
              <Link
                to="/applications"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 border border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917]"
              >
                Riwayat Lamaran Saya
              </Link>
            )}

            {isRecruiter && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 border border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917]"
                >
                  Dashboard Recruiter
                </Link>
                <Link
                  to="/jobs/create"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 fm-btn fm-btn-primary text-center"
                >
                  + Posting Lowongan Baru
                </Link>
              </>
            )}

            {!isLoggedIn && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="fm-btn py-2 text-center border-[#D9CFC7] bg-[#EFE9E3]"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="fm-btn fm-btn-primary py-2 text-center"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
