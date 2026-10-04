import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Plus, Edit2, Trash2, ExternalLink, RefreshCw, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { useJobs } from '../hooks/useJobs';
import { useApplications } from '../hooks/useApplications';

export default function RecruiterDashboardPage({ showToast }) {
  const { myJobs, loading: jobsLoading, error: jobsError, fetchMyJobs, deleteJob } = useJobs();
  const { dashboardStats, loading: statsLoading, fetchDashboardStats } = useApplications();

  const [isLivePolling, setIsLivePolling] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const prevTotalApplicantsRef = useRef(null);

  // Initial load
  useEffect(() => {
    const initData = async () => {
      const [jobsData, statsData] = await Promise.all([
        fetchMyJobs(),
        fetchDashboardStats()
      ]);
      setLastSyncTime(new Date());
      if (statsData && statsData.total_applicants !== undefined) {
        prevTotalApplicantsRef.current = statsData.total_applicants;
      }
    };
    initData();
  }, [fetchMyJobs, fetchDashboardStats]);

  // Real-time Long Polling Loop (tiap 3 detik di latar belakang)
  useEffect(() => {
    if (!isLivePolling) return;

    let isMounted = true;
    const interval = setInterval(async () => {
      // Jeda jika tab browser tidak aktif untuk efisiensi resource
      if (document.hidden) return;

      try {
        setIsSyncing(true);
        const [latestJobs, latestStats] = await Promise.all([
          fetchMyJobs({ silent: true }),
          fetchDashboardStats({ silent: true })
        ]);

        if (!isMounted) return;

        setLastSyncTime(new Date());

        // Deteksi pelamar baru yang masuk secara realtime
        if (latestStats && latestStats.total_applicants !== undefined) {
          const prevTotal = prevTotalApplicantsRef.current;
          const newTotal = latestStats.total_applicants;

          if (prevTotal !== null && newTotal > prevTotal) {
            const diff = newTotal - prevTotal;
            if (showToast) {
              showToast(`📢 Live Alert: Ada ${diff} berkas pelamar baru masuk ke dashboard Anda!`);
            }
          }
          prevTotalApplicantsRef.current = newTotal;
        }
      } catch (err) {
        console.error('Silent polling error on dashboard:', err);
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
  }, [isLivePolling, fetchMyJobs, fetchDashboardStats, showToast]);

  const handleManualRefresh = async () => {
    try {
      setIsSyncing(true);
      const [jobsData, statsData] = await Promise.all([
        fetchMyJobs({ silent: true }),
        fetchDashboardStats({ silent: true })
      ]);
      setLastSyncTime(new Date());
      if (statsData && statsData.total_applicants !== undefined) {
        prevTotalApplicantsRef.current = statsData.total_applicants;
      }
      if (showToast) showToast('Data dashboard berhasil disinkronkan.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus lowongan "${title}"?`)) {
      return;
    }

    try {
      await deleteJob(id);
      if (showToast) showToast(`Lowongan "${title}" berhasil dihapus.`);
      fetchDashboardStats({ silent: true });
    } catch (err) {
      if (showToast) showToast(err.message || 'Gagal menghapus lowongan.');
    }
  };

  const loading = jobsLoading || statsLoading;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#D9CFC7] gap-4 mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-[#6b5c47] text-[10px] uppercase tracking-widest font-semibold mb-1">
            <Briefcase size={14} />
            <span>Recruiter Console</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1c1917]">
            Dashboard Rekrutmen
          </h1>
          <p className="font-serif italic text-sm text-[#57534e] mt-1">
            Ringkasan posisi terbuka, total pelamar yang masuk, dan manajemen lowongan.
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
            className="fm-btn py-2 px-3 border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917] hover:border-[#1c1917] flex items-center gap-1.5 transition-all"
            title="Segarkan data secara manual"
          >
            <RefreshCw size={13} className={loading || isSyncing ? 'animate-spin text-[#6b5c47]' : ''} />
            <span>Segarkan</span>
          </button>
          <Link
            to="/jobs/create"
            className="fm-btn fm-btn-primary py-2 px-4 flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={14} />
            <span>Posting Lowongan Baru</span>
          </Link>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-[#F9F8F6] border border-[#D9CFC7] shadow-sm">
          <div className="flex items-center justify-between text-[#78716c] mb-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold">Total Lowongan</span>
            <Briefcase size={14} />
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-bold text-[#1c1917]">
            {dashboardStats?.total_jobs_posted !== undefined ? dashboardStats.total_jobs_posted : myJobs.length}
          </div>
          <div className="text-[10px] text-[#57534e] mt-1">Posisi aktif Anda</div>
        </div>

        <div className="p-4 bg-[#F9F8F6] border border-[#D9CFC7] shadow-sm">
          <div className="flex items-center justify-between text-[#78716c] mb-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold">Total Pelamar</span>
            <Users size={14} />
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-bold text-[#1c1917]">
            {dashboardStats?.total_applicants || 0}
          </div>
          <div className="text-[10px] text-[#57534e] mt-1">Berkas kandidat masuk</div>
        </div>

        <div className="p-4 bg-[#F9F8F6] border border-[#D9CFC7] shadow-sm">
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold">Menunggu Review</span>
            <Clock size={14} />
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-bold text-amber-900">
            {dashboardStats?.pending_count || 0}
          </div>
          <div className="text-[10px] text-[#57534e] mt-1">Perlu ditindaklanjuti</div>
        </div>

        <div className="p-4 bg-[#F9F8F6] border border-[#D9CFC7] shadow-sm">
          <div className="flex items-center justify-between text-blue-700 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold">Sudah Direview</span>
            <CheckCircle2 size={14} />
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-bold text-blue-900">
            {dashboardStats?.reviewed_count || 0}
          </div>
          <div className="text-[10px] text-[#57534e] mt-1">Kandidat dalam proses</div>
        </div>
      </div>

      {/* Error state */}
      {jobsError && (
        <div className="p-4 bg-[#ffdad6]/40 border border-[#ba1a1a] text-[#ba1a1a] flex items-start gap-3 my-6">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Terjadi kendala saat memuat lowongan:</p>
            <p className="text-[11px] font-sans">{jobsError}</p>
          </div>
        </div>
      )}

      {/* Jobs Table Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-[#1c1917]">
            Daftar Lowongan Pekerjaan Anda
          </h2>
          <span className="text-[11px] text-[#78716c]">
            Total {myJobs.length} posisi terdaftar
          </span>
        </div>

        {myJobs.length === 0 && !jobsLoading ? (
          <div className="py-16 px-4 bg-[#F9F8F6] border border-[#D9CFC7] text-center space-y-4">
            <Briefcase size={36} className="mx-auto text-[#78716c]" />
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="font-heading text-base font-bold text-[#1c1917]">
                Belum Ada Lowongan yang Diposting
              </h3>
              <p className="font-sans text-xs text-[#57534e]">
                Mulai pasang lowongan pekerjaan baru untuk mencari kandidat terbaik bagi perusahaan Anda.
              </p>
            </div>
            <Link
              to="/jobs/create"
              className="fm-btn fm-btn-primary px-5 py-2 inline-flex items-center gap-1.5"
            >
              <Plus size={13} />
              <span>Posting Lowongan Sekarang</span>
            </Link>
          </div>
        ) : (
          <div className="border border-[#D9CFC7] bg-[#F9F8F6] overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D9CFC7] bg-[#EFE9E3] text-[10px] uppercase tracking-wider text-[#57534e]">
                  <th className="py-3 px-4">Judul & Perusahaan</th>
                  <th className="py-3 px-4">Tipe & Lokasi</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9CFC7]/60">
                {myJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-[#EFE9E3]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1c1917] text-xs">
                        <Link to={`/jobs/${job.id}`} className="hover:underline flex items-center gap-1">
                          {job.title}
                          <ExternalLink size={10} className="text-[#78716c]" />
                        </Link>
                      </div>
                      <div className="text-[11px] text-[#57534e] font-sans mt-0.5">{job.company}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-[#57534e]">
                      <span className="px-2 py-0.5 text-[9px] uppercase border border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917] font-semibold mr-1.5">
                        {job.type}
                      </span>
                      <span>{job.location || 'Remote'}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        job.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {job.is_active ? 'Aktif' : 'Tutup'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/jobs/${job.id}/applicants`}
                          className="fm-btn px-2.5 py-1.5 text-[10px] border-[#D9CFC7] bg-[#EFE9E3] hover:border-[#1c1917] hover:bg-[#F9F8F6] text-[#1c1917] inline-flex items-center gap-1.5 font-bold transition-all shadow-sm"
                          title={`Lihat ${job.total_applicants !== undefined ? job.total_applicants : 0} Pelamar Lowongan Ini`}
                        >
                          <Users size={13} className="text-[#6b5c47]" />
                          <span>Pelamar</span>
                          <span className="px-1.5 py-0.2 bg-[#1c1917] text-[#F9F8F6] text-[10px] font-mono font-bold">
                            {job.total_applicants !== undefined ? job.total_applicants : 0}
                          </span>
                        </Link>

                        <Link
                          to={`/jobs/${job.id}/edit`}
                          className="p-1.5 text-[#57534e] hover:text-[#1c1917] border border-[#D9CFC7] bg-[#EFE9E3]"
                          title="Edit Lowongan"
                        >
                          <Edit2 size={12} />
                        </Link>

                        <button
                          onClick={() => handleDelete(job.id, job.title)}
                          className="p-1.5 text-[#ba1a1a] hover:bg-[#ffdad6]/40 border border-[#ba1a1a]/30"
                          title="Hapus Lowongan"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
