import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Calendar, Building2, MapPin, Clock, ArrowUpRight, Inbox, RefreshCw, AlertCircle } from 'lucide-react';
import { useApplications } from '../hooks/useApplications';

export default function ApplicationsPage({ showToast }) {
  const { applications, loading, error, fetchMyApplications } = useApplications();
  const [isLivePolling, setIsLivePolling] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const previousStatusMapRef = useRef({});

  // Initial load
  useEffect(() => {
    fetchMyApplications().then((list) => {
      setLastSyncTime(new Date());
      if (Array.isArray(list)) {
        const map = {};
        list.forEach((app) => {
          map[app.id] = app.status;
        });
        previousStatusMapRef.current = map;
      }
    });
  }, [fetchMyApplications]);

  // Real-time Long Polling Loop (tiap 3 detik)
  useEffect(() => {
    if (!isLivePolling) return;

    let isMounted = true;
    const interval = setInterval(async () => {
      if (document.hidden) return;

      try {
        setIsSyncing(true);
        const latest = await fetchMyApplications({ silent: true });
        if (!isMounted) return;

        setLastSyncTime(new Date());

        if (Array.isArray(latest)) {
          latest.forEach((app) => {
            const prev = previousStatusMapRef.current[app.id];
            if (prev && prev !== app.status) {
              const jobTitle = app.job?.title || app.title || 'Pekerjaan';
              const statusLabel =
                app.status === 'reviewed'
                  ? 'DIREVIEW RECRUITER'
                  : app.status === 'rejected'
                  ? 'TIDAK LOLOS'
                  : 'MENUNGGU';

              if (showToast) {
                showToast(`🔔 Status lamaran "${jobTitle}" telah diperbarui menjadi: ${statusLabel}!`);
              }
            }
          });

          const map = {};
          latest.forEach((app) => {
            map[app.id] = app.status;
          });
          previousStatusMapRef.current = map;
        }
      } catch (err) {
        console.error('Silent polling error:', err);
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isLivePolling, fetchMyApplications, showToast]);

  const handleManualRefresh = async () => {
    try {
      setIsSyncing(true);
      const list = await fetchMyApplications({ silent: true });
      setLastSyncTime(new Date());
      if (Array.isArray(list)) {
        const map = {};
        list.forEach((app) => {
          map[app.id] = app.status;
        });
        previousStatusMapRef.current = map;
      }
      if (showToast) showToast('Data status lamaran berhasil disinkronkan.');
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'reviewed':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-300">
            ● Direview Recruiter
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-300">
            ✕ Tidak Lolos
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
            ⏳ Menunggu Review
          </span>
        );
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#D9CFC7] gap-4 mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-[#6b5c47] text-[10px] uppercase tracking-widest font-semibold mb-1">
            <Briefcase size={14} />
            <span>Portal Kandidat</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1c1917]">
            Riwayat Lamaran Saya
          </h1>
          <p className="font-serif italic text-sm text-[#57534e] mt-1">
            Pantau status seleksi berkas dossier dan konfirmasi dari hiring team.
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
            disabled={loading || isSyncing}
            className="fm-btn py-2 px-3 border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917] hover:border-[#1c1917] flex items-center justify-center gap-1.5 transition-all text-xs"
            title="Segarkan data secara manual"
          >
            <RefreshCw
              size={13}
              className={loading || isSyncing ? 'animate-spin text-[#6b5c47]' : ''}
            />
            <span>Segarkan</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-20 text-center text-[#78716c] space-y-2">
          <RefreshCw size={24} className="mx-auto animate-spin text-[#6b5c47]" />
          <p>Memuat riwayat lamaran Anda...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-4 bg-[#ffdad6]/40 border border-[#ba1a1a] text-[#ba1a1a] flex items-start gap-3 my-6">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Terjadi kendala saat memuat data:</p>
            <p className="text-[11px] font-sans">{error}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && applications.length === 0 && (
        <div className="py-16 px-4 bg-[#F9F8F6] border border-[#D9CFC7] text-center space-y-4 my-6">
          <Inbox size={40} className="mx-auto text-[#78716c]" />
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-heading text-base font-bold text-[#1c1917]">
              Belum Ada Lamaran yang Dikirim
            </h3>
            <p className="font-sans text-xs text-[#57534e]">
              Anda belum melamar lowongan apapun. Jelajahi katalog lowongan terkurasi kami dan kirimkan lamaran pertama Anda.
            </p>
          </div>
          <Link
            to="/jobs"
            className="fm-btn fm-btn-primary px-5 py-2 inline-flex items-center gap-1.5"
          >
            <span>Jelajahi Lowongan</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      )}

      {/* Application List */}
      {!loading && !error && applications.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-[11px] text-[#78716c] pb-2">
            <span>Menampilkan <strong>{applications.length}</strong> lamaran terkirim</span>
          </div>

          <div className="divide-y divide-[#D9CFC7] border border-[#D9CFC7] bg-[#F9F8F6]">
            {applications.map((app) => {
              const jobTitle = app.job?.title || app.job_title || 'Lowongan Pekerjaan';
              const company = app.job?.company || app.job_company || 'Perusahaan';
              const location = app.job?.location || app.job_location || 'Remote / Hybrid';
              const jobType = app.job?.type || app.job_type || 'full-time';

              return (
                <div key={app.id} className="p-4 sm:p-6 hover:bg-[#EFE9E3]/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        {getStatusBadge(app.status)}
                        <span className="px-2 py-0.5 text-[9px] uppercase border border-[#D9CFC7] bg-[#EFE9E3] text-[#57534e]">
                          {jobType}
                        </span>
                      </div>
                      <h3 className="font-heading text-base sm:text-lg font-bold text-[#1c1917]">
                        {jobTitle}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#57534e] mt-1 font-sans">
                        <span className="flex items-center gap-1 font-semibold text-[#1c1917]">
                          <Building2 size={13} /> {company}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin size={13} /> {location}
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center shrink-0 pt-2 sm:pt-0">
                      <div className="flex items-center gap-1 text-[10px] text-[#78716c]">
                        <Clock size={12} />
                        <span>Dilamar {formatDate(app.applied_at)}</span>
                      </div>
                      <Link
                        to={`/jobs/${app.job_id}`}
                        className="mt-2 text-[11px] font-bold text-[#6b5c47] hover:text-[#1c1917] inline-flex items-center gap-1"
                      >
                        <span>Lihat Lowongan</span>
                        <ArrowUpRight size={12} />
                      </Link>
                    </div>
                  </div>

                  {/* Cover letter snippet */}
                  {app.cover_letter && (
                    <div className="mt-3 p-3 bg-[#EFE9E3]/70 border-l-2 border-[#6b5c47] text-[11px] text-[#57534e] font-serif italic">
                      <span className="font-mono text-[9px] uppercase tracking-wider not-italic block font-bold text-[#1c1917] mb-0.5">
                        Catatan Pengantar Anda:
                      </span>
                      "{app.cover_letter}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
