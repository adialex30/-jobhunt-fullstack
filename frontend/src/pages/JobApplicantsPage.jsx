import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Inbox,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  ExternalLink,
  ChevronDown,
  Filter
} from 'lucide-react';
import { useApplications } from '../hooks/useApplications';
import { useJobs } from '../hooks/useJobs';

export default function JobApplicantsPage({ showToast }) {
  const { id } = useParams();
  const {
    applicants,
    loading: appsLoading,
    error: appsError,
    fetchJobApplicants,
    updateStatus
  } = useApplications();
  const { fetchJobById, currentJob } = useJobs();

  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedLetters, setExpandedLetters] = useState({});
  const [isLivePolling, setIsLivePolling] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const previousApplicantsRef = useRef([]);

  // Initial load
  useEffect(() => {
    if (id) {
      fetchJobById(id);
      fetchJobApplicants(id).then((data) => {
        setLastSyncTime(new Date());
        previousApplicantsRef.current = data || [];
      });
    }
  }, [id, fetchJobById, fetchJobApplicants]);

  // Real-time Polling Loop (tiap 3 detik tanpa refresh halaman)
  useEffect(() => {
    if (!id || !isLivePolling) return;

    let isMounted = true;
    const interval = setInterval(async () => {
      // Jeda polling jika tab browser tidak aktif untuk menghemat resource
      if (document.hidden) return;

      try {
        setIsSyncing(true);
        const latest = await fetchJobApplicants(id, { silent: true });
        if (!isMounted) return;

        setLastSyncTime(new Date());

        // Deteksi jika ada pelamar baru yang masuk secara realtime
        if (latest && previousApplicantsRef.current) {
          const prevCount = previousApplicantsRef.current.length;
          const newCount = latest.length;
          if (newCount > prevCount && prevCount > 0) {
            const diff = newCount - prevCount;
            if (showToast) {
              showToast(`📢 Live Alert: ${diff} pelamar baru masuk!`);
            }
          }
          previousApplicantsRef.current = latest;
        }
      } catch (err) {
        console.error('Silent polling error:', err);
      } finally {
        if (isMounted) {
          setIsSyncing(false);
        }
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [id, isLivePolling, fetchJobApplicants, showToast]);

  const handleManualRefresh = async () => {
    try {
      setIsSyncing(true);
      const data = await fetchJobApplicants(id, { silent: true });
      setLastSyncTime(new Date());
      previousApplicantsRef.current = data || [];
      if (showToast) showToast('Data pelamar berhasil disinkronkan.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      setUpdatingId(appId);
      await updateStatus(appId, newStatus);
      if (showToast) showToast(`Status pelamar berhasil diubah menjadi '${newStatus}'.`);
    } catch (err) {
      if (showToast) showToast(err.message || 'Gagal mengubah status pelamar.');
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpandLetter = (appId) => {
    setExpandedLetters((prev) => ({
      ...prev,
      [appId]: !prev[appId]
    }));
  };

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return isoString;
    }
  };

  // Metrics calculation
  const counts = useMemo(() => {
    const total = applicants.length;
    const pending = applicants.filter((a) => a.status === 'pending').length;
    const reviewed = applicants.filter((a) => a.status === 'reviewed').length;
    const rejected = applicants.filter((a) => a.status === 'rejected').length;
    return { total, pending, reviewed, rejected };
  }, [applicants]);

  // Filtered applicants
  const filteredApplicants = useMemo(() => {
    return applicants.filter((app) => {
      const name = (app.applicant?.name || app.applicant_name || '').toLowerCase();
      const email = (app.applicant?.email || app.applicant_email || '').toLowerCase();
      const query = searchTerm.toLowerCase().trim();

      const matchesSearch = !query || name.includes(query) || email.includes(query);
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applicants, searchTerm, statusFilter]);

  const renderStatusBadge = (status) => {
    if (status === 'reviewed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100/90 text-blue-900 border border-blue-300">
          <CheckCircle2 size={11} className="text-blue-700" />
          <span>Direview</span>
        </span>
      );
    }
    if (status === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-100/90 text-red-900 border border-red-300">
          <XCircle size={11} className="text-red-700" />
          <span>Tidak Lolos</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-100/90 text-amber-900 border border-amber-300">
        <Clock size={11} className="text-amber-700" />
        <span>Menunggu</span>
      </span>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 font-mono text-xs">
      {/* Navigation Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-[11px]">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-[#78716c] hover:text-[#1c1917] transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Kembali ke Dashboard Recruiter</span>
        </Link>

        {currentJob?.id && (
          <Link
            to={`/jobs/${currentJob.id}`}
            className="inline-flex items-center gap-1 text-[#6b5c47] hover:underline"
          >
            <span>Lihat Publikasi Lowongan</span>
            <ExternalLink size={12} />
          </Link>
        )}
      </div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b border-[#D9CFC7] gap-4 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[#6b5c47] text-[10px] uppercase tracking-widest font-semibold">
            <Users size={14} />
            <span>Kandidat Dispatch • Lowongan #{id}</span>
          </div>
          <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-[#1c1917] leading-tight">
            {currentJob?.title ? `Pelamar: ${currentJob.title}` : 'Memuat Data Pelamar...'}
          </h1>
          <p className="font-serif italic text-xs sm:text-sm text-[#57534e]">
            {currentJob?.company ? `${currentJob.company} • ` : ''}Tinjau berkas portofolio pelamar dan tentukan status seleksi kandidat.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
          {/* Live Polling Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-2 bg-[#EFE9E3] border border-[#D9CFC7] text-[11px] font-mono">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isLivePolling ? 'bg-emerald-600 animate-pulse' : 'bg-[#78716c]'
              }`}
            />
            <span className="font-bold text-[#1c1917] tracking-wider text-[10px] uppercase">
              {isLivePolling ? 'Realtime 3s' : 'Sync Jeda'}
            </span>
            {isSyncing && (
              <RefreshCw size={11} className="animate-spin text-[#6b5c47] shrink-0" />
            )}
            {lastSyncTime && (
              <span className="text-[10px] text-[#78716c] border-l border-[#D9CFC7] pl-2 hidden xs:inline">
                {lastSyncTime.toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            )}
            <button
              type="button"
              onClick={() => setIsLivePolling(!isLivePolling)}
              className="text-[10px] font-bold underline ml-1 text-[#6b5c47] hover:text-[#1c1917]"
              title={isLivePolling ? 'Jeda sinkronisasi realtime' : 'Aktifkan sinkronisasi realtime'}
            >
              {isLivePolling ? 'Jeda' : 'Aktif'}
            </button>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={appsLoading || isSyncing}
            className="fm-btn py-2 px-3 border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917] hover:border-[#1c1917] flex items-center justify-center gap-1.5 transition-all text-xs"
            title="Segarkan data secara manual"
          >
            <RefreshCw
              size={13}
              className={appsLoading || isSyncing ? 'animate-spin text-[#6b5c47]' : ''}
            />
            <span>Segarkan</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Barometer (Responsive 2 cols on mobile, 4 on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-6">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`p-3 sm:p-4 text-left border transition-all ${
            statusFilter === 'all'
              ? 'bg-[#1c1917] text-[#F9F8F6] border-[#1c1917] shadow-sm'
              : 'bg-[#F9F8F6] text-[#1c1917] border-[#D9CFC7] hover:border-[#1c1917]'
          }`}
        >
          <div className="text-[10px] uppercase tracking-wider opacity-75">Total Pelamar</div>
          <div className="font-heading text-lg sm:text-2xl font-bold mt-1">{counts.total}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('pending')}
          className={`p-3 sm:p-4 text-left border transition-all ${
            statusFilter === 'pending'
              ? 'bg-amber-900 text-amber-50 border-amber-900 shadow-sm'
              : 'bg-[#F9F8F6] text-[#1c1917] border-[#D9CFC7] hover:border-amber-700'
          }`}
        >
          <div className="text-[10px] uppercase tracking-wider text-amber-700 font-bold">Menunggu (Pending)</div>
          <div className="font-heading text-lg sm:text-2xl font-bold mt-1 text-amber-800">{counts.pending}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('reviewed')}
          className={`p-3 sm:p-4 text-left border transition-all ${
            statusFilter === 'reviewed'
              ? 'bg-blue-900 text-blue-50 border-blue-900 shadow-sm'
              : 'bg-[#F9F8F6] text-[#1c1917] border-[#D9CFC7] hover:border-blue-700'
          }`}
        >
          <div className="text-[10px] uppercase tracking-wider text-blue-700 font-bold">Direview</div>
          <div className="font-heading text-lg sm:text-2xl font-bold mt-1 text-blue-800">{counts.reviewed}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('rejected')}
          className={`p-3 sm:p-4 text-left border transition-all ${
            statusFilter === 'rejected'
              ? 'bg-red-900 text-red-50 border-red-900 shadow-sm'
              : 'bg-[#F9F8F6] text-[#1c1917] border-[#D9CFC7] hover:border-red-700'
          }`}
        >
          <div className="text-[10px] uppercase tracking-wider text-red-700 font-bold">Tidak Lolos</div>
          <div className="font-heading text-lg sm:text-2xl font-bold mt-1 text-red-800">{counts.rejected}</div>
        </button>
      </div>

      {/* Search and Filters Controls */}
      <div className="bg-[#EFE9E3] border border-[#D9CFC7] p-3 sm:p-4 mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78716c]" />
          <input
            type="text"
            placeholder="Cari pelamar berdasarkan nama atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F9F8F6] border border-[#D9CFC7] pl-8 pr-3 py-2 text-xs text-[#1c1917] focus:outline-none focus:border-[#1c1917] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={13} className="text-[#6b5c47] shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F9F8F6] border border-[#D9CFC7] py-2 px-3 text-xs text-[#1c1917] focus:outline-none focus:border-[#1c1917] w-full sm:w-auto"
          >
            <option value="all">Semua Status ({counts.total})</option>
            <option value="pending">Status: Menunggu ({counts.pending})</option>
            <option value="reviewed">Status: Direview ({counts.reviewed})</option>
            <option value="rejected">Status: Tidak Lolos ({counts.rejected})</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {appsLoading && (
        <div className="py-20 text-center text-[#78716c] space-y-2 bg-[#F9F8F6] border border-[#D9CFC7]">
          <RefreshCw size={24} className="mx-auto animate-spin text-[#6b5c47]" />
          <p className="text-xs">Memuat daftar pelamar...</p>
        </div>
      )}

      {/* Error state */}
      {appsError && !appsLoading && (
        <div className="p-4 bg-[#ffdad6]/40 border border-[#ba1a1a] text-[#ba1a1a] flex items-start gap-3 my-6">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Terjadi kendala saat memuat pelamar:</p>
            <p className="text-[11px] font-sans">{appsError}</p>
          </div>
        </div>
      )}

      {/* Empty State: No applicants at all */}
      {!appsLoading && !appsError && applicants.length === 0 && (
        <div className="py-16 px-4 bg-[#F9F8F6] border border-[#D9CFC7] text-center space-y-4 my-6">
          <Inbox size={40} className="mx-auto text-[#78716c]" />
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-heading text-base font-bold text-[#1c1917]">
              Belum Ada Pelamar Masuk
            </h3>
            <p className="font-sans text-xs text-[#57534e]">
              Belum ada kandidat yang mengajukan lamaran untuk lowongan ini.
            </p>
          </div>
        </div>
      )}

      {/* Empty State: Filter results in 0 */}
      {!appsLoading && !appsError && applicants.length > 0 && filteredApplicants.length === 0 && (
        <div className="py-12 px-4 bg-[#F9F8F6] border border-[#D9CFC7] text-center space-y-3 my-6">
          <Search size={32} className="mx-auto text-[#78716c]" />
          <p className="text-xs text-[#57534e]">
            Tidak ada pelamar yang cocok dengan kriteria pencarian atau filter yang dipilih.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            className="fm-btn px-3 py-1.5 bg-[#EFE9E3] border-[#D9CFC7] text-[#1c1917] text-xs hover:border-[#1c1917]"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1. DESKTOP / TABLET VIEW: Modern Responsive Table (md: and up) */}
      {/* ============================================================== */}
      {!appsLoading && !appsError && filteredApplicants.length > 0 && (
        <>
          <div className="hidden md:block">
            <div className="border border-[#D9CFC7] bg-[#F9F8F6] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[720px]">
                  <thead>
                    <tr className="border-b border-[#D9CFC7] bg-[#EFE9E3] text-[10px] uppercase tracking-wider text-[#57534e]">
                      <th className="py-3.5 px-4 font-bold w-[28%]">Kandidat</th>
                      <th className="py-3.5 px-4 font-bold w-[34%]">Surat Lamaran</th>
                      <th className="py-3.5 px-4 font-bold w-[14%]">Tanggal Masuk</th>
                      <th className="py-3.5 px-4 font-bold w-[12%]">Status</th>
                      <th className="py-3.5 px-4 font-bold w-[12%] text-right">Ubah Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D9CFC7]/60">
                    {filteredApplicants.map((app) => {
                      const applicantName = app.applicant?.name || app.applicant_name || 'Kandidat';
                      const applicantEmail = app.applicant?.email || app.applicant_email || '-';
                      const isExpanded = Boolean(expandedLetters[app.id]);
                      const letter = app.cover_letter || '';
                      const isLongLetter = letter.length > 90;

                      return (
                        <tr
                          key={app.id}
                          className="hover:bg-[#EFE9E3]/50 transition-colors group"
                        >
                          {/* Col 1: Nama & Email dengan Initial Avatar */}
                          <td className="py-4 px-4 align-top">
                            <div className="flex items-start gap-2.5">
                              <div className="w-7 h-7 bg-[#1c1917] text-[#F9F8F6] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                {applicantName.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-[#1c1917] text-xs truncate">
                                  {applicantName}
                                </div>
                                <div className="text-[11px] text-[#57534e] font-sans flex items-center gap-1 mt-0.5 truncate">
                                  <Mail size={11} className="text-[#78716c] shrink-0" />
                                  <span className="truncate">{applicantEmail}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Col 2: Surat Lamaran (Cover letter) */}
                          <td className="py-4 px-4 align-top">
                            {letter ? (
                              <div>
                                <p
                                  className={`text-[11px] text-[#57534e] font-serif italic leading-relaxed ${
                                    isExpanded ? '' : 'line-clamp-2'
                                  }`}
                                >
                                  "{letter}"
                                </p>
                                {isLongLetter && (
                                  <button
                                    type="button"
                                    onClick={() => toggleExpandLetter(app.id)}
                                    className="text-[10px] text-[#6b5c47] font-mono underline hover:text-[#1c1917] mt-1 block"
                                  >
                                    {isExpanded ? 'Sembunyikan' : 'Baca Selengkapnya...'}
                                  </button>
                                )}
                              </div>
                            ) : (
                              <span className="text-[10px] text-[#78716c] italic">
                                Tanpa surat lamaran
                              </span>
                            )}
                          </td>

                          {/* Col 3: Tanggal Masuk */}
                          <td className="py-4 px-4 align-top text-[11px] text-[#57534e] whitespace-nowrap">
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Clock size={12} className="text-[#78716c] shrink-0" />
                              <span>{formatDate(app.applied_at)}</span>
                            </div>
                          </td>

                          {/* Col 4: Status Seleksi Badge */}
                          <td className="py-4 px-4 align-top whitespace-nowrap">
                            {renderStatusBadge(app.status)}
                          </td>

                          {/* Col 5: Dropdown Action Ubah Status */}
                          <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                            <select
                              disabled={updatingId === app.id}
                              value={app.status}
                              onChange={(e) => handleStatusChange(app.id, e.target.value)}
                              className="fm-input py-1.5 px-2 text-[11px] bg-[#EFE9E3] border-[#D9CFC7] hover:border-[#1c1917] focus:border-[#1c1917] cursor-pointer disabled:opacity-50"
                            >
                              <option value="pending">Set: Pending</option>
                              <option value="reviewed">Set: Reviewed</option>
                              <option value="rejected">Set: Rejected</option>
                            </select>
                            {updatingId === app.id && (
                              <span className="block text-[9px] text-[#6b5c47] mt-1 animate-pulse">
                                Menyimpan...
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 2. MOBILE CARD VIEW: Optimized Touch & Stacked Layout (< md:)  */}
          {/* ============================================================== */}
          <div className="block md:hidden space-y-3">
            {filteredApplicants.map((app) => {
              const applicantName = app.applicant?.name || app.applicant_name || 'Kandidat';
              const applicantEmail = app.applicant?.email || app.applicant_email || '-';
              const isExpanded = Boolean(expandedLetters[app.id]);
              const letter = app.cover_letter || '';
              const isLongLetter = letter.length > 90;

              return (
                <div
                  key={app.id}
                  className="bg-[#F9F8F6] border border-[#D9CFC7] p-4 shadow-sm space-y-3 transition-colors hover:border-[#1c1917]"
                >
                  {/* Top: Avatar, Name, Email & Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 bg-[#1c1917] text-[#F9F8F6] flex items-center justify-center font-bold text-xs shrink-0">
                        {applicantName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-[#1c1917] text-xs truncate">
                          {applicantName}
                        </h4>
                        <div className="text-[11px] text-[#57534e] font-sans flex items-center gap-1 truncate">
                          <Mail size={11} className="text-[#78716c] shrink-0" />
                          <span className="truncate">{applicantEmail}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {renderStatusBadge(app.status)}
                    </div>
                  </div>

                  {/* Body: Cover Letter / Catatan */}
                  {letter ? (
                    <div className="bg-[#EFE9E3]/50 border border-[#D9CFC7] p-2.5 rounded-none">
                      <div className="text-[10px] text-[#6b5c47] uppercase tracking-wider font-semibold mb-1">
                        Surat Lamaran:
                      </div>
                      <p
                        className={`text-[11px] text-[#57534e] font-serif italic leading-relaxed ${
                          isExpanded ? '' : 'line-clamp-3'
                        }`}
                      >
                        "{letter}"
                      </p>
                      {isLongLetter && (
                        <button
                          type="button"
                          onClick={() => toggleExpandLetter(app.id)}
                          className="text-[10px] text-[#6b5c47] font-mono underline hover:text-[#1c1917] mt-1.5 block"
                        >
                          {isExpanded ? 'Tutup Ringkas' : 'Baca Selengkapnya...'}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-[10px] text-[#78716c] italic bg-[#EFE9E3]/30 p-2">
                      Kandidat tidak menyertakan surat lamaran.
                    </div>
                  )}

                  {/* Footer Action: Tanggal & Selector Ubah Status */}
                  <div className="pt-2 border-t border-[#D9CFC7]/70 flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-1.5 text-[10px] text-[#78716c]">
                      <Clock size={12} className="text-[#6b5c47]" />
                      <span>Masuk: {formatDate(app.applied_at)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#57534e] uppercase font-bold shrink-0">
                        Status:
                      </span>
                      <select
                        disabled={updatingId === app.id}
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="fm-input flex-1 py-1 px-2 text-[10px] bg-[#EFE9E3] border-[#D9CFC7] font-bold"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Count Info */}
          <div className="text-[11px] text-[#78716c] text-center pt-2">
            Menampilkan <strong>{filteredApplicants.length}</strong> dari{' '}
            <strong>{applicants.length}</strong> pelamar terdaftar
          </div>
        </>
      )}
    </div>
  );
}
