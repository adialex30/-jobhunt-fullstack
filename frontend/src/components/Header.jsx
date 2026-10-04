import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bookmark,
  PlusCircle,
  Bell,
  User,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  LogOut,
  SlidersHorizontal,
  FileText,
  Briefcase
} from 'lucide-react';

export default function Header({
  isLoggedIn = true,
  onLogin,
  onLogout,
  savedJobsCount = 0,
  onOpenSaved,
  onOpenPostModal,
  onOpenManageJobs,
  showToast
}) {
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
      time: '12m ago',
      unread: true
    },
    {
      id: 2,
      title: 'Issue Nº 42 Published',
      desc: 'Bespoke Advisory Index for Q2 is now open for review.',
      time: '2h ago',
      unread: true
    },
    {
      id: 3,
      title: 'Dossier Dispatched',
      desc: 'Your confidential Aura credentials were sent to Mirage Applied AI.',
      time: '1d ago',
      unread: false
    }
  ];

  return (
    <header className="w-full bg-[#F9F8F6] border-b border-[#D9CFC7] sticky top-0 z-40 backdrop-blur-md bg-opacity-95 transition-all">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">

        {/* Brand & Live Archive Status */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            onClick={() => navigate('/')}
            className="flex flex-col cursor-pointer group"
          >
            <span className="font-heading text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#1c1917] leading-none group-hover:text-[#6b5c47] transition-colors">
              forcemajeure.bzh
            </span>
            <span className="hidden sm:block text-[9px] sm:text-[10px] font-mono text-[#78716c] uppercase tracking-widest mt-1">
              CURATED EXECUTIVE & TECH ARCHIVE
            </span>
          </div>

          <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 border border-[#D9CFC7] bg-[#EFE9E3] text-[10px] font-mono text-[#57534e]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>INDEX ACTIVE</span>
          </div>
        </div>

        {/* Right Section: Notifications + Saved + Post + My Jobs + Profile (when logged in) */}
        <div className="flex items-center gap-1.5 sm:gap-3 font-mono text-xs ml-auto">

          {/* Clock (Desktop) */}
          <div className="hidden xl:block text-[11px] text-[#78716c] border-r border-[#D9CFC7] pr-3">
            {currentTime}
          </div>

          {isLoggedIn ? (
            <>
              {/* Notifications Component with Popover (hidden on very small screens, visible in drawer) */}
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

                {/* Notification Dropdown Panel */}
                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-sm sm:max-w-md bg-[#F9F8F6] border border-[#D9CFC7] shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="flex items-center justify-between pb-2 border-b border-[#D9CFC7] mb-2">
                      <span className="font-heading text-xs font-bold text-[#1c1917] uppercase tracking-wider">
                        Archive Dispatches
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (showToast) showToast('All notifications marked as read');
                          setIsNotifOpen(false);
                        }}
                        className="text-[10px] text-[#78716c] hover:text-[#1c1917]"
                      >
                        Mark all read
                      </button>
                    </div>

                    <div className="flex flex-col divide-y divide-[#D9CFC7]/50 max-h-72 overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n.id} className="py-2.5 px-1 hover:bg-[#EFE9E3] transition-colors cursor-pointer">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-bold text-[#1c1917]">{n.title}</span>
                            <span className="text-[10px] text-[#78716c]">{n.time}</span>
                          </div>
                          <p className="text-[11px] font-sans text-[#57534e] leading-snug">
                            {n.desc}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 mt-2 border-t border-[#D9CFC7] text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setIsNotifOpen(false);
                          if (showToast) showToast('Opening dispatch archives...');
                        }}
                        className="text-[10px] font-bold text-[#6b5c47] hover:text-[#1c1917] uppercase tracking-wider"
                      >
                        View Full Dispatch History →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Saved Component */}
              <button
                type="button"
                onClick={onOpenSaved}
                className="fm-btn py-1.5 px-2.5 sm:px-3 text-[11px] flex items-center gap-1.5 relative border-[#D9CFC7] hover:border-[#1c1917] bg-[#EFE9E3] text-[#1c1917]"
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

              {/* Post Opening Button */}
              {onOpenPostModal && (
                <button
                  type="button"
                  onClick={onOpenPostModal}
                  className="hidden md:inline-flex fm-btn fm-btn-primary py-1.5 px-3 text-[11px] items-center gap-1.5"
                >
                  <PlusCircle size={13} />
                  <span>POST</span>
                </button>
              )}

              {/* Recruiter Manage Jobs Button */}
              {onOpenManageJobs && (
                <button
                  type="button"
                  onClick={onOpenManageJobs}
                  className="hidden lg:inline-flex fm-btn py-1.5 px-3 text-[11px] items-center gap-1.5 border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917] hover:border-[#1c1917]"
                  title="Kelola Lowongan Anda (/api/jobs/mine)"
                >
                  {/* <Briefcase size={12} className="text-[#6b5c47]" /> */}
                  <span>MY JOBS</span>
                </button>
              )}

              {/* Profile Component with Popover */}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1.5 p-0.5 border border-[#D9CFC7] hover:border-[#1c1917] bg-[#EFE9E3] transition-all"
                  aria-label="User Profile"
                >
                  <img
                    alt="Aura Candidate Profile"
                    className="w-7 h-7 object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNKAti8C5geDQ8G07eu5sJkBXwFCANxx6UsqXNvOwIVtX1CYOh38dI0vghKlJyWsTEpy1jQj1MrwWs5kndmlSG-PdMghwtVhILItpMnpcWqFhRYKuovgIxpQ1th2xX7K03dhRIlNGDNSa50TBQ1cgeKxGa6LGYxox7X2sYhUTFOHT0igbgux7nGqUR2y-Wa_3tEQvcxM4ConQDQegm6r34E5LFA9kyN5H70IAQG9H-DN3tDuDe0ZLp"
                  />
                  <ChevronDown size={11} className="text-[#78716c] mr-1 hidden sm:inline" />
                </button>

                {/* Profile Dropdown Panel */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-xs sm:w-64 bg-[#F9F8F6] border border-[#D9CFC7] shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="flex items-center gap-3 pb-3 border-b border-[#D9CFC7]">
                      <img
                        alt="Profile"
                        className="w-10 h-10 object-cover border border-[#D9CFC7]"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNKAti8C5geDQ8G07eu5sJkBXwFCANxx6UsqXNvOwIVtX1CYOh38dI0vghKlJyWsTEpy1jQj1MrwWs5kndmlSG-PdMghwtVhILItpMnpcWqFhRYKuovgIxpQ1th2xX7K03dhRIlNGDNSa50TBQ1cgeKxGa6LGYxox7X2sYhUTFOHT0igbgux7nGqUR2y-Wa_3tEQvcxM4ConQDQegm6r34E5LFA9kyN5H70IAQG9H-DN3tDuDe0ZLp"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-[#1c1917] truncate text-xs">Alex Sterling</span>
                        <span className="text-[10px] text-[#78716c] truncate">Staff Spatial Designer</span>
                        <span className="text-[9px] text-[#6b5c47] font-semibold mt-0.5">● Aura Verified Dossier</span>
                      </div>
                    </div>

                    <div className="py-2 flex flex-col gap-1 text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          if (showToast) showToast('Opening Candidate Dossier...');
                        }}
                        className="flex items-center gap-2 p-1.5 hover:bg-[#EFE9E3] text-[#1c1917] text-left transition-colors"
                      >
                        <FileText size={13} className="text-[#6b5c47]" />
                        <span>Curated Dossier</span>
                      </button>

                      {onOpenManageJobs && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            onOpenManageJobs();
                          }}
                          className="flex items-center gap-2 p-1.5 hover:bg-[#EFE9E3] text-[#1c1917] text-left transition-colors font-bold text-[#6b5c47]"
                        >
                          {/* <Briefcase size={13} className="text-[#6b5c47]" /> */}
                          <span>Kelola Lowongan (/mine)</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          onOpenSaved && onOpenSaved();
                        }}
                        className="flex items-center gap-2 p-1.5 hover:bg-[#EFE9E3] text-[#1c1917] text-left transition-colors"
                      >
                        <Bookmark size={13} className="text-[#6b5c47]" />
                        <span>Saved Bookmarks ({savedJobsCount})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          if (showToast) showToast('Opening Profile Preferences...');
                        }}
                        className="flex items-center gap-2 p-1.5 hover:bg-[#EFE9E3] text-[#1c1917] text-left transition-colors"
                      >
                        <SlidersHorizontal size={13} className="text-[#6b5c47]" />
                        <span>Comp & Privacy Settings</span>
                      </button>
                    </div>

                    <div className="pt-2 border-t border-[#D9CFC7]">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          if (onLogout) onLogout();
                          if (showToast) showToast('Signed out of Aura Talent Archive.');
                        }}
                        className="w-full flex items-center justify-between p-1.5 text-[11px] text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors"
                      >
                        <span>Sign Out</span>
                        <LogOut size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* When NOT logged in: Show Connect / Sign In */
            <button
              type="button"
              onClick={() => {
                if (onLogin) onLogin();
                if (showToast) showToast('Signed in successfully.');
              }}
              className="fm-btn fm-btn-primary py-1.5 px-3.5 text-[11px] flex items-center gap-1.5"
            >
              <User size={13} />
              <span>SIGN IN</span>
            </button>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 border border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917] hover:border-[#1c1917]"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer (Menu & Quick Actions) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#D9CFC7] bg-[#F9F8F6] px-4 py-4 space-y-3 font-mono text-xs animate-in slide-in-from-top-2">
          {/* Mobile Quick Actions (Post, My Jobs, Saved) */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {onOpenPostModal && (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenPostModal();
                }}
                className="fm-btn fm-btn-primary py-2 px-3 text-[11px] flex items-center justify-center gap-1.5"
              >
                <PlusCircle size={13} />
                <span>Pasang Lowongan</span>
              </button>
            )}

            {onOpenManageJobs && (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenManageJobs();
                }}
                className="fm-btn py-2 px-3 text-[11px] flex items-center justify-center gap-1.5 border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917]"
              >
                <Briefcase size={12} className="text-[#6b5c47]" />
                <span>Kelola (/mine)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenSaved && onOpenSaved();
              }}
              className="col-span-2 fm-btn py-2 px-3 text-[11px] flex items-center justify-center gap-1.5 border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917]"
            >
              <Bookmark size={13} className={savedJobsCount > 0 ? "fill-[#C9B59C] text-[#6b5c47]" : "text-[#57534e]"} />
              <span>Lowongan Tersimpan ({savedJobsCount})</span>
            </button>
          </div>

          <div className="pt-2 border-t border-[#D9CFC7] flex items-center justify-between text-[10px] text-[#78716c]">
            <span>{currentTime || 'JAKARTA / UTC+7'}</span>
            <span>INDEX ACTIVE • ISSUE Nº 42</span>
          </div>
        </div>
      )}
    </header>
  );
}
