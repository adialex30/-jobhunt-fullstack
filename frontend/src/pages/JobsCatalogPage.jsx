import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Briefcase, Filter, ChevronLeft, ChevronRight, Bookmark, ArrowRight } from 'lucide-react';
import { jobService } from '../services/jobService';

export default function JobsCatalogPage({ savedJobIds = [], onToggleBookmark, showToast }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'all');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  const [jobsData, setJobsData] = useState({
    jobs: [],
    totalJobs: 0,
    totalPages: 1,
    currentPage: 1
  });
  const [isLoading, setIsLoading] = useState(true);

  // Sync with URL query parameters (e.g. from Header search)
  useEffect(() => {
    const urlKeyword = searchParams.get('keyword');
    const urlType = searchParams.get('type');
    const urlLocation = searchParams.get('location');
    const urlPage = searchParams.get('page');

    if (urlKeyword !== null) setKeyword(urlKeyword);
    if (urlType !== null) setSelectedType(urlType);
    if (urlLocation !== null) setSelectedLocation(urlLocation);
    if (urlPage !== null) setCurrentPage(parseInt(urlPage, 10) || 1);
  }, [searchParams]);

  // Fetch jobs whenever filters or page changes
  useEffect(() => {
    let isCancelled = false;

    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const result = await jobService.getJobs({
          page: currentPage,
          limit: 6,
          keyword,
          type: selectedType,
          location: selectedLocation
        });

        if (!isCancelled && result && result.data) {
          setJobsData({
            jobs: Array.isArray(result.data.jobs) ? result.data.jobs : [],
            totalJobs: result.data.totalJobs || 0,
            totalPages: result.data.totalPages || 1,
            currentPage: result.data.currentPage || 1
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
  }, [currentPage, keyword, selectedType, selectedLocation]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    const newParams = new URLSearchParams();
    if (keyword.trim()) newParams.set('keyword', keyword.trim());
    if (selectedType && selectedType !== 'all') newParams.set('type', selectedType);
    if (selectedLocation && selectedLocation !== 'all') newParams.set('location', selectedLocation);
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
    <div className="w-full max-w-[1360px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 font-mono">
      {/* Header Bar */}
      <div className="mb-5 sm:mb-8">
        <div className="flex items-center gap-2 text-[#6b5c47] text-xs uppercase tracking-widest font-semibold mb-2">
          <span>Katalog Karir Terkurasi</span>
          <span>•</span>
          <span>{jobsData.totalJobs} Lowongan Aktif</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1c1917] tracking-tight">
          Peluang Karir Eksekutif dan Tech
        </h1>
        <p className="font-sans text-xs sm:text-sm text-[#57534e] mt-1 max-w-2xl leading-relaxed">
          Temukan lowongan dengan kualifikasi mendalam, kompensasi transparan, dan reputasi terverifikasi.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#EFE9E3] border border-[#D9CFC7] p-3 sm:p-4 mb-5 sm:mb-8">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3 items-center">
          {/* Keyword Search */}
          <div className="sm:col-span-12 lg:col-span-5 flex items-center bg-[#F9F8F6] border border-[#D9CFC7] px-3 py-2 text-xs">
            <Search size={15} className="text-[#78716c] mr-2 shrink-0" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Cari posisi, perusahaan, atau skill..."
              className="bg-transparent border-none outline-none text-[#1c1917] w-full font-mono text-xs"
            />
          </div>

          {/* Job Type Filter */}
          <div className="sm:col-span-6 lg:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#F9F8F6] border border-[#D9CFC7] px-3 py-2 text-xs text-[#1c1917] outline-none cursor-pointer"
            >
              <option value="all">Semua Tipe Pekerjaan</option>
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          {/* Location Filter */}
          <div className="sm:col-span-6 lg:col-span-3">
            <select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#F9F8F6] border border-[#D9CFC7] px-3 py-2 text-xs text-[#1c1917] outline-none cursor-pointer"
            >
              <option value="all">Semua Lokasi</option>
              <option value="remote">Remote (Worldwide / ID)</option>
              <option value="jakarta">Jakarta</option>
              <option value="san francisco">San Francisco</option>
              <option value="london">London</option>
            </select>
          </div>

          {/* Filter Action */}
          <div className="sm:col-span-12 lg:col-span-1">
            <button
              type="submit"
              className="w-full fm-btn fm-btn-primary py-2 text-xs flex items-center justify-center gap-1"
            >
              <span>Cari</span>
            </button>
          </div>
        </form>
      </div>

      {/* Jobs Catalog Stream */}
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
              setSelectedType('all');
              setSelectedLocation('all');
              setCurrentPage(1);
            }}
            className="mt-4 fm-btn px-4 py-2 border-[#D9CFC7] bg-[#F9F8F6] text-[#1c1917] hover:border-[#1c1917]"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {jobsData.jobs.map((job) => {
            const isSaved = savedJobIds.includes(String(job.id));
            return (
              <article
                key={job.id}
                className="bg-[#F9F8F6] border border-[#D9CFC7] p-4 sm:p-6 hover:border-[#1c1917] transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="font-bold text-[#6b5c47] text-xs uppercase tracking-wider block">
                        {job.company}
                      </span>
                      <Link to={`/jobs/${job.id}`}>
                        <h2 className="font-heading text-lg sm:text-xl font-bold text-[#1c1917] group-hover:text-[#6b5c47] transition-colors mt-0.5 leading-snug">
                          {job.title}
                        </h2>
                      </Link>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => onToggleBookmark && onToggleBookmark(e, String(job.id))}
                      className="p-1.5 text-[#78716c] hover:text-[#1c1917] transition-colors shrink-0"
                      aria-label="Simpan lowongan"
                    >
                      <Bookmark size={16} className={isSaved ? 'fill-[#C9B59C] text-[#6b5c47]' : ''} />
                    </button>
                  </div>

                  <p className="font-sans text-xs text-[#57534e] line-clamp-2 my-3 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mb-4 text-[10px]">
                    <span className="bg-[#EFE9E3] border border-[#D9CFC7] px-2.5 py-0.5 uppercase font-bold text-[#1c1917]">
                      {job.type}
                    </span>
                    <span className="bg-[#EFE9E3] border border-[#D9CFC7] px-2.5 py-0.5 text-[#57534e]">
                      {job.location || 'Remote'}
                    </span>
                    <span className="bg-[#f2dcc2]/60 text-[#70604b] px-2.5 py-0.5 font-bold">
                      {formatSalary(job.salary_min, job.salary_max)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D9CFC7]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                  <span className="text-[10px] text-[#78716c] truncate max-w-[200px] sm:max-w-none">
                    Diposting oleh: {job.recruiter_name || 'Verified Recruiter'}
                  </span>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="fm-btn fm-btn-primary px-3.5 py-1.5 text-[11px] flex items-center justify-center gap-1.5 w-full sm:w-auto"
                  >
                    <span>Detail & Lamar</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {jobsData.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8 sm:mt-12 pt-6 border-t border-[#D9CFC7]">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="fm-btn px-3 py-1.5 text-xs border-[#D9CFC7] bg-[#EFE9E3] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ChevronLeft size={14} />
            <span className="hidden xs:inline">Sebelumnya</span>
          </button>

          {/* Mobile Page Info */}
          <div className="sm:hidden font-mono text-xs px-2 text-[#57534e]">
            {currentPage} / {jobsData.totalPages}
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            {Array.from({ length: jobsData.totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 text-xs font-bold transition-colors ${currentPage === pageNum
                  ? 'bg-[#1c1917] text-[#F9F8F6]'
                  : 'bg-[#EFE9E3] border border-[#D9CFC7] text-[#1c1917] hover:bg-[#D9CFC7]'
                  }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={currentPage >= jobsData.totalPages}
            onClick={() => setCurrentPage((p) => Math.min(jobsData.totalPages, p + 1))}
            className="fm-btn px-3 py-1.5 text-xs border-[#D9CFC7] bg-[#EFE9E3] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <span className="hidden xs:inline">Selanjutnya</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
