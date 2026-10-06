import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Bookmark,
  LogOut,
  LayoutDashboard,
  FileText,
  Users,
  User,
  Menu,
  X,
  Plus
} from 'lucide-react';

export default function Header({
  savedJobsCount = 0,
  onOpenSaved,
  showToast
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn, isRecruiter, isJobSeeker, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on page transition
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    if (showToast) {
      showToast('You have successfully logged out.');
    }
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path.includes('tab=candidates')) {
      return location.pathname === '/opportunities' && location.search.includes('tab=candidates');
    }
    if (path.includes('tab=jobs')) {
      return location.pathname === '/opportunities' && (location.search.includes('tab=jobs') || !location.search);
    }
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="w-full bg-[#F9F8F6] border-b border-[#D9CFC7] sticky top-0 z-40 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">

        {/* Brand / Logo */}
        <Link to="/" className="flex flex-col group shrink-0">
          <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[#1c1917] group-hover:text-[#6b5c47] transition-colors leading-none">
            jobhunt.bzh
          </h1>
          <span className="text-[9px] text-[#57534e] uppercase tracking-widest mt-1">
            TALENT &amp; CAREER PLATFORM
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs">
          <Link
            to="/"
            className={`px-3 py-1.5 transition-colors font-bold uppercase tracking-wider ${isActive('/')
                ? 'bg-[#1c1917] text-[#F9F8F6]'
                : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#EFE9E3]'
              }`}
          >
            Home
          </Link>

          {isLoggedIn && isRecruiter && (
            <>
              <Link
                to="/dashboard"
                className={`px-3 py-1.5 transition-colors font-bold uppercase tracking-wider flex items-center gap-1.5 ${isActive('/dashboard')
                    ? 'bg-[#1c1917] text-[#F9F8F6]'
                    : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#EFE9E3]'
                  }`}
              >
                <LayoutDashboard size={13} />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/opportunities?tab=candidates"
                className={`px-3 py-1.5 transition-colors font-bold uppercase tracking-wider flex items-center gap-1.5 ${isActive('/opportunities?tab=candidates')
                    ? 'bg-[#1c1917] text-[#F9F8F6]'
                    : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#EFE9E3]'
                  }`}
              >
                <Users size={13} />
                <span>Candidate Bench</span>
              </Link>
            </>
          )}

          {(!isLoggedIn || isJobSeeker) && (
            <Link
              to="/opportunities?tab=jobs"
              className={`px-3 py-1.5 transition-colors font-bold uppercase tracking-wider flex items-center gap-1.5 ${isActive('/opportunities?tab=jobs')
                  ? 'bg-[#1c1917] text-[#F9F8F6]'
                  : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#EFE9E3]'
                }`}
            >
              <Briefcase size={13} />
              <span>Job Opportunities</span>
            </Link>
          )}

          {isLoggedIn && isJobSeeker && (
            <Link
              to="/applications"
              className={`px-3 py-1.5 transition-colors font-bold uppercase tracking-wider flex items-center gap-1.5 ${isActive('/applications')
                  ? 'bg-[#1c1917] text-[#F9F8F6]'
                  : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#EFE9E3]'
                }`}
            >
              <FileText size={13} />
              <span>My Applications</span>
            </Link>
          )}

          {isLoggedIn && (
            <Link
              to="/profile"
              className={`px-3 py-1.5 transition-colors font-bold uppercase tracking-wider flex items-center gap-1.5 ${isActive('/profile')
                  ? 'bg-[#1c1917] text-[#F9F8F6]'
                  : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#EFE9E3]'
                }`}
            >
              <User size={13} />
              <span>Profile</span>
            </Link>
          )}
        </nav>

        {/* Desktop User Actions */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3 text-xs">
          {isLoggedIn && isJobSeeker && onOpenSaved && (
            <button
              type="button"
              onClick={onOpenSaved}
              className="p-1.5 sm:px-2.5 sm:py-1 border border-[#D9CFC7] bg-[#EFE9E3] hover:border-[#1c1917] text-[#1c1917] flex items-center gap-1 text-[11px]"
              title="Saved Jobs"
            >
              <Bookmark size={13} />
              <span className="hidden sm:inline">Saved</span>
              <span className="bg-[#1c1917] text-[#F9F8F6] text-[9px] px-1.5 py-0.2 font-bold">
                {savedJobsCount}
              </span>
            </button>
          )}

          {isLoggedIn ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#D9CFC7]">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-[#1c1917] font-bold text-xs max-w-[130px] truncate">
                  {user?.name}
                </span>
                <span className={`text-[9px] font-bold uppercase ${isRecruiter ? 'text-[#6b5c47]' : 'text-[#78716c]'}`}>
                  {isRecruiter ? 'IT Recruiter' : 'IT Job Seeker'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="px-2.5 py-1.5 border border-[#D9CFC7] bg-[#EFE9E3] text-[#57534e] hover:text-red-700 hover:border-red-300 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                title="Log out of account"
              >
                <LogOut size={12} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 border border-[#D9CFC7] bg-[#EFE9E3] hover:border-[#1c1917] text-[#1c1917] font-bold uppercase tracking-wider text-[11px]"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 bg-[#1c1917] hover:bg-[#C9B59C] hover:text-[#1c1917] text-[#F9F8F6] font-bold uppercase tracking-wider text-[11px] transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Header Right (Saved counter + Hamburger button) */}
        <div className="flex md:hidden items-center gap-2">
          {isLoggedIn && isJobSeeker && onOpenSaved && (
            <button
              type="button"
              onClick={onOpenSaved}
              className="p-1.5 border border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917] flex items-center gap-1 text-[11px]"
              title="Saved Jobs"
            >
              <Bookmark size={13} />
              <span className="bg-[#1c1917] text-[#F9F8F6] text-[9px] px-1 font-bold">
                {savedJobsCount}
              </span>
            </button>
          )}

          {isLoggedIn && (
            <span className={`text-[10px] px-2 py-0.5 font-bold uppercase ${isRecruiter ? 'bg-[#1c1917] text-[#F9F8F6]' : 'bg-[#C9B59C] text-[#1c1917]'
              }`}>
              {isRecruiter ? 'RECRUITER' : 'SEEKER'}
            </span>
          )}

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 border border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917] hover:border-[#1c1917]"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#D9CFC7] bg-[#F9F8F6] px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {isLoggedIn && (
            <div className="p-3 bg-[#EFE9E3] border border-[#D9CFC7] mb-2 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#1c1917] block truncate">
                  {user?.name}
                </span>
                <span className="text-[10px] text-[#78716c] font-mono">
                  {user?.email}
                </span>
              </div>
              <span className={`text-[9px] px-2 py-0.5 font-bold uppercase ${isRecruiter ? 'bg-[#1c1917] text-[#F9F8F6]' : 'bg-[#C9B59C] text-[#1c1917]'
                }`}>
                {isRecruiter ? 'Recruiter' : 'Job Seeker'}
              </span>
            </div>
          )}

          <nav className="flex flex-col space-y-1 text-xs">
            <Link
              to="/"
              className={`px-3 py-2 font-bold uppercase tracking-wider transition-colors ${isActive('/') ? 'bg-[#1c1917] text-[#F9F8F6]' : 'text-[#57534e] hover:bg-[#EFE9E3]'
                }`}
            >
              Home
            </Link>

            {isLoggedIn && isRecruiter && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${isActive('/dashboard') ? 'bg-[#1c1917] text-[#F9F8F6]' : 'text-[#57534e] hover:bg-[#EFE9E3]'
                    }`}
                >
                  <LayoutDashboard size={14} />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/opportunities?tab=candidates"
                  className={`px-3 py-2 font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${isActive('/opportunities?tab=candidates') ? 'bg-[#1c1917] text-[#F9F8F6]' : 'text-[#57534e] hover:bg-[#EFE9E3]'
                    }`}
                >
                  <Users size={14} />
                  <span>Candidate Bench</span>
                </Link>

                <Link
                  to="/jobs/create"
                  className="px-3 py-2 font-bold uppercase tracking-wider flex items-center gap-2 text-[#57534e] hover:bg-[#EFE9E3]"
                >
                  <Plus size={14} />
                  <span>Post a Job</span>
                </Link>
              </>
            )}

            {(!isLoggedIn || isJobSeeker) && (
              <Link
                to="/opportunities?tab=jobs"
                className={`px-3 py-2 font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${isActive('/opportunities?tab=jobs') ? 'bg-[#1c1917] text-[#F9F8F6]' : 'text-[#57534e] hover:bg-[#EFE9E3]'
                  }`}
              >
                <Briefcase size={14} />
                <span>Job Opportunities</span>
              </Link>
            )}

            {isLoggedIn && isJobSeeker && (
              <Link
                to="/applications"
                className={`px-3 py-2 font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${isActive('/applications') ? 'bg-[#1c1917] text-[#F9F8F6]' : 'text-[#57534e] hover:bg-[#EFE9E3]'
                  }`}
              >
                <FileText size={14} />
                <span>My Applications</span>
              </Link>
            )}

            {isLoggedIn && (
              <Link
                to="/profile"
                className={`px-3 py-2 font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${isActive('/profile') ? 'bg-[#1c1917] text-[#F9F8F6]' : 'text-[#57534e] hover:bg-[#EFE9E3]'
                  }`}
              >
                <User size={14} />
                <span>Profile</span>
              </Link>
            )}
          </nav>

          <div className="pt-3 border-t border-[#D9CFC7]">
            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 px-3 border border-[#D9CFC7] bg-[#EFE9E3] text-[#ba1a1a] hover:bg-red-50 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <LogOut size={13} />
                <span>Log Out</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="py-2 px-3 text-center border border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917] font-bold uppercase text-xs"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="py-2 px-3 text-center bg-[#1c1917] text-[#F9F8F6] font-bold uppercase text-xs"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
