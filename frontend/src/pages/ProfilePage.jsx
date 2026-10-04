import React from 'react';
import { User, Mail, Shield, Calendar, LogOut, CheckCircle2, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-mono text-xs">
      <div className="bg-[#F9F8F6] border border-[#D9CFC7] shadow-xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b border-[#D9CFC7]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#1c1917] text-[#F9F8F6] flex items-center justify-center font-heading text-2xl font-bold border border-[#D9CFC7]">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-xl sm:text-2xl font-bold text-[#1c1917]">
                  {user.name}
                </h1>
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 size={10} /> Terverifikasi
                </span>
              </div>
              <p className="text-[11px] text-[#78716c] mt-0.5">
                Role Akun: <strong className="text-[#1c1917] uppercase">{user.role}</strong>
              </p>
            </div>
          </div>
        </div>
        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border border-[#D9CFC7] bg-[#EFE9E3]/50 space-y-1">
            <div className="flex items-center gap-1.5 text-[#78716c] text-[10px] uppercase tracking-wider font-semibold">
              <Mail size={13} />
              <span>Alamat Email</span>
            </div>
            <div className="text-sm font-bold text-[#1c1917] truncate">{user.email}</div>
          </div>

          <div className="p-4 border border-[#D9CFC7] bg-[#EFE9E3]/50 space-y-1">
            <div className="flex items-center gap-1.5 text-[#78716c] text-[10px] uppercase tracking-wider font-semibold">
              <Shield size={13} />
              <span>ID Akun & Hak Akses</span>
            </div>
            <div className="text-sm font-bold text-[#1c1917]">
              User #{user.id} ({user.role === 'recruiter' ? 'Recruiter Employer' : 'Job Seeker Talent'})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
