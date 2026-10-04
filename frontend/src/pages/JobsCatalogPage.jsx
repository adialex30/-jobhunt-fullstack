import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Briefcase, Filter, ChevronLeft, ChevronRight, Bookmark, ArrowRight, ArrowUpDown } from 'lucide-react';
import { jobService } from '../services/jobService';
import { useAuth } from '../context/AuthContext';

const JOB_TYPES = [
  { value: 'all', label: 'Semua Tipe' },
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' }
];

const LOCATIONS = [
  { value: 'all', label: 'Semua Lokasi' },
  { value: 'Remote', label: 'Remote (Worldwide)' },
  { value: 'Jakarta', label: 'Jakarta' },
  { value: 'San Francisco', label: 'San Francisco' },
  { value: 'New York', label: 'New York' },
  { value: 'London', label: 'London' }
];

export default function JobsCatalogPage({ savedJobIds = [], onToggleBookmark, showToast }) {
  const { isRecruiter } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'all');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'applicants'
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  const [jobsData, setJobsData] = useState({
    jobs: [],
    totalJobs: 0,
    totalPages: 1,
    currentPage: 1
  });
  const [isLoading, setIsLoading] = useState(true);

  // Debounced search query (300ms)
  const debounceTimerRef = useRef(null);
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

  const handleKeywordChange = (e) => {
    const val = e.target.value;
    setKeyword(val);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedKeyword(val);
      setCurrentPage(1);
    }, 300);
  };

  // Sync with URL query parameters
  useEffect(() => {
    const urlKeyword = searchParams.get('keyword');
    const urlType = searchParams.get('type');
    const urlLocation = searchParams.get('location');
    const urlPage = searchParams.get('page');

    if (urlKeyword !== null) {
      setKeyword(urlKeyword);
      setDebouncedKeyword(urlKeyword);
    }
    if (urlType !== null) setSelectedType(urlType);
    if (urlLocation !== null) setSelectedLocation(urlLocation);
    if (urlPage !== null) setCurrentPage(parseInt(urlPage, 10) || 1);
  }, [searchParams]);

  // Fetch jobs whenever filters or debounced keyword changes
  useEffect(() => {
    let isCancelled = false;

    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const result = await jobService.getJobs({
          page: currentPage,
          limit: 9, // 9 items per page for 3-column desktop layout
          keyword: debouncedKeyword,
          type: selectedType,
          location: selectedLocation
        });

        if (!isCancelled && result && result.data) {
          let list = Array.isArray(result.data.jobs) ? result.data.jobs : (Array.isArray(result.data) ? result.data : []);

          // Sorting client-side if applicants sort requested
          if (sortBy === 'applicants') {
            list = [...list].sort((a, b) => (b.applicants_count || 0) - (a.applicants_count || 0));
          } else {
            // Newest
            list = [...list].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
          }

          setJobsData({
            jobs: list,
            totalJobs: result.data.totalJobs || result.pagination?.totalJobs || list.length,
            totalPages: result.data.totalPages || result.pagination?.totalPages || 1,
            currentPage: result.data.currentPage || result.pagination?.currentPage || 1
          });
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Error loading jobs:', err);
          if (showToast) showToast('Gagal memuat lowongan pekerjaan.');
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    fetchJobs();

    return () => {
      isCancelled = true;
    };
  }, [currentPage, debouncedKeyword, selectedType, selectedLocation, sortBy]);

  const handleFilterChange = (typeVal, locVal, sortVal) => {
    setCurrentPage(1);
    const newParams = new URLSearchParams();
    if (keyword.trim()) newParams.set('keyword', keyword.trim());
    if (typeVal && typeVal !== 'all') newParams.set('type', typeVal);
    if (locVal && locVal !== 'all') newParams.set('location', locVal);
    setSearchParams(newParams);
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Gaji Dirahasiakan / Kompetitif';
    const fmt = (num) => `Rp ${(num / 1000000).toFixed(0)} jt`;
    if (min && max) return `${fmt(min)} – ${fmt(max)} / bln`;
    if (min) return `Mulai ${fmt(min)} / bln`;
    return `Hingga ${fmt(max)} / bln`;
  };

  return (
    <div className="w-full max-w-[1360px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 font-mono text-xs">
      {/* Header Bar */}
      <div className="mb-5 sm:mb-8">
        <div className="flex items-center gap-2 text-[#6b5c47] text-[10px] uppercase tracking-widest font-semibold mb-2">
          <span>Katalog Karir Terkurasi</span>
          <span>•</span>
          <span>{jobsData.totalJobs} Lowongan Aktif</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#1c1917]">
          Jelajahi Posisi Terbuka
        </h1>
        <p className="font-serif italic text-xs sm:text-sm text-[#57534e] mt-1 max-w-2xl leading-relaxed">
          Arsip lowongan langsung dari studio teknologi, agensi desain, dan tech company terverifikasi.
        </p>
      </div>

      {/* Filter and Search Control Panel */}
      <div className="bg-[#F9F8F6] border border-[#D9CFC7] p-3 sm:p-5 mb-6 sm:mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Real-time Debounced Search Input (Requirement 4.2) */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78716c]" />
            <input
              type="text"
              placeholder="Cari judul posisi atau nama perusahaan (real-time 300ms)..."
              value={keyword}
              onChange={handleKeywordChange}
              className="fm-input w-full pl-9 pr-3 py-2 text-xs"
            />
          </div>

          {/* Filters & Sorting Panel */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            {/* Filter Tipe (Full-time, Part-time, Contract, Internship) */}
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                handleFilterChange(e.target.value, selectedLocation, sortBy);
              }}
              className="fm-input py-2 px-2.5 text-xs bg-[#F9F8F6] flex-1 sm:flex-initial"
            >
              {JOB_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>

            {/* Filter Lokasi (termasuk opsi 'Remote') */}
            <select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                handleFilterChange(selectedType, e.target.value, sortBy);
              }}
              className="fm-input py-2 px-2.5 text-xs bg-[#F9F8F6] flex-1 sm:flex-initial"
            >
              {LOCATIONS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>

            {/* Sorting (Terbaru atau Paling Banyak Pelamar) */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="fm-input py-2 px-2.5 text-xs bg-[#EFE9E3] border-[#1c1917] flex-1 sm:flex-initial font-bold"
            >
              <option value="newest">Terbaru</option>
              <option value="applicants">Paling Banyak Pelamar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Catalog Grid - Responsive (1 col mobile, 2 col tablet, 3 col desktop - Requirement 4.2) */}
      {isLoading ? (
        <div className="py-20 text-center font-mono text-xs text-[#78716c]">
          Memuat daftar lowongan pekerjaan dari server...
        </div>
      ) : jobsData.jobs.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-[#D9CFC7] bg-[#EFE9E3]/50 p-8">
          <p className="font-heading text-lg font-bold text-[#1c1917]">
            Tidak ada lowongan yang sesuai dengan kriteria filter.
          </p>
          <p className="font-sans text-xs text-[#57534e] mt-2">
            Cobalah ubah kata kunci pencarian atau reset filter tipe dan lokasi.
          </p>
          <button
            type="button"
            onClick={() => {
              setKeyword('');
              setDebouncedKeyword('');
              setSelectedType('all');
              setSelectedLocation('all');
              setSortBy('newest');
              setCurrentPage(1);
            }}
            className="mt-4 fm-btn px-4 py-2 border-[#D9CFC7] bg-[#F9F8F6] text-[#1c1917] hover:border-[#1c1917]"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {jobsData.jobs.map((job) => {
            const isSaved = savedJobIds.includes(String(job.id));
            return (
              <article
                key={job.id}
                className="bg-[#F9F8F6] border border-[#D9CFC7] p-4 sm:p-5 hover:border-[#1c1917] transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="font-bold text-[#6b5c47] text-[11px] uppercase tracking-wider block">
                        {job.company}
                      </span>
                      <Link to={`/jobs/${job.id}`}>
                        <h2 className="font-heading text-base sm:text-lg font-bold text-[#1c1917] group-hover:text-[#6b5c47] transition-colors mt-0.5 leading-snug">
                          {job.title}
                        </h2>
                      </Link>
                    </div>

                    {!isRecruiter && (
                      <button
                        type="button"
                        onClick={(e) => onToggleBookmark && onToggleBookmark(e, String(job.id))}
                        className="p-1.5 text-[#78716c] hover:text-[#1c1917] transition-colors shrink-0"
                        aria-label="Simpan lowongan"
                      >
                        <Bookmark size={15} className={isSaved ? 'fill-[#C9B59C] text-[#6b5c47]' : ''} />
                      </button>
                    )}
                  </div>

                  <p className="font-sans text-xs text-[#57534e] line-clamp-2 my-2.5 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 mb-4 text-[9px]">
                    <span className="bg-[#EFE9E3] border border-[#D9CFC7] px-2 py-0.5 uppercase font-bold text-[#1c1917]">
                      {job.type}
                    </span>
                    <span className="bg-[#EFE9E3] border border-[#D9CFC7] px-2 py-0.5 text-[#57534e]">
                      {job.location || 'Remote'}
                    </span>
                    <span className="bg-[#f2dcc2]/60 text-[#70604b] px-2 py-0.5 font-bold">
                      {formatSalary(job.salary_min, job.salary_max)}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#D9CFC7]/60 flex items-center justify-between gap-2 text-[10px]">
                  <span className="text-[#78716c] truncate">
                    {job.recruiter_name || 'Verified Recruiter'}
                  </span>

                  <Link
                    to={`/jobs/${job.id}`}
                    className="fm-btn fm-btn-primary px-3 py-1 flex items-center gap-1 shrink-0 font-bold"
                  >
                    <span>Detail</span>
                    <ArrowRight size={11} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {jobsData.totalPages > 1 && (
        <div className="mt-8 pt-6 border-t border-[#D9CFC7] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] text-[#57534e]">
            Menampilkan halaman <strong>{jobsData.currentPage}</strong> dari <strong>{jobsData.totalPages}</strong> (Total {jobsData.totalJobs} lowongan)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={jobsData.currentPage <= 1 || isLoading}
              className="fm-btn px-3 py-1.5 border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917] disabled:opacity-40 flex items-center gap-1"
            >
              <ChevronLeft size={13} />
              <span>Sebelumnya</span>
            </button>

            <span className="px-3 py-1.5 bg-[#1c1917] text-[#F9F8F6] font-bold">
              {jobsData.currentPage}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(jobsData.totalPages, p + 1))}
              disabled={jobsData.currentPage >= jobsData.totalPages || isLoading}
              className="fm-btn px-3 py-1.5 border-[#D9CFC7] bg-[#EFE9E3] text-[#1c1917] disabled:opacity-40 flex items-center gap-1"
            >
              <span>Selanjutnya</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
