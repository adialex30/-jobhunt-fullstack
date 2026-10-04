import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Briefcase, ArrowLeft, Save, AlertCircle, RefreshCw } from 'lucide-react';
import { useJobs } from '../hooks/useJobs';

const JOB_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' }
];

export default function EditJobPage({ showToast }) {
  const { id } = useParams();
  const { fetchJobById, updateJob } = useJobs();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    description: '',
    requirements: '',
    salary_min: '',
    salary_max: '',
    is_active: true
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadJob() {
      setLoading(true);
      const job = await fetchJobById(id);
      if (job) {
        setFormData({
          title: job.title || '',
          company: job.company || '',
          location: job.location || '',
          type: job.type || 'full-time',
          description: job.description || '',
          requirements: job.requirements || '',
          salary_min: job.salary_min !== null && job.salary_min !== undefined ? job.salary_min : '',
          salary_max: job.salary_max !== null && job.salary_max !== undefined ? job.salary_max : '',
          is_active: job.is_active !== undefined ? Boolean(job.is_active) : true
        });
      } else {
        setError('Lowongan tidak ditemukan atau Anda tidak memiliki akses.');
      }
      setLoading(false);
    }

    if (id) loadJob();
  }, [id, fetchJobById]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const minSal = formData.salary_min ? parseInt(formData.salary_min, 10) : null;
    const maxSal = formData.salary_max ? parseInt(formData.salary_max, 10) : null;

    if (minSal && maxSal && minSal > maxSal) {
      setError('Gaji minimum tidak boleh lebih besar dari gaji maksimum.');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateJob(id, {
        ...formData,
        salary_min: minSal,
        salary_max: maxSal
      });

      if (showToast) showToast('Lowongan pekerjaan berhasil diperbarui!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Gagal memperbarui lowongan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center font-mono text-xs text-[#78716c] flex items-center justify-center gap-2">
        <RefreshCw size={16} className="animate-spin text-[#6b5c47]" />
        <span>Memuat data lowongan...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-mono text-xs">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-[#78716c] hover:text-[#1c1917] mb-6 text-[11px]"
      >
        <ArrowLeft size={13} />
        <span>Kembali ke Dashboard</span>
      </Link>

      <div className="bg-[#F9F8F6] border border-[#D9CFC7] shadow-xl p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-1.5 text-[#6b5c47] text-[10px] uppercase tracking-widest font-semibold mb-1">
            <Briefcase size={14} />
            <span>Edit Lowongan #{id}</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-[#1c1917]">
            Perbarui Data Lowongan
          </h1>
          <p className="font-serif italic text-xs text-[#57534e] mt-1">
            Sesuaikan detail kualifikasi, rentang kompensasi, atau status lowongan.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-[#ffdad6]/40 border border-[#ba1a1a]/40 text-[#ba1a1a] flex items-start gap-2 text-[11px]">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1c1917] mb-1">
              Judul Posisi Lowongan *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="fm-input w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1c1917] mb-1">
                Nama Perusahaan *
              </label>
              <input
                type="text"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="fm-input w-full"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1c1917] mb-1">
                Lokasi Kerja
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="fm-input w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1c1917] mb-1">
                Tipe Pekerjaan *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="fm-input w-full"
              >
                {JOB_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1c1917] mb-1">
                Status Lowongan
              </label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#1c1917]"
                />
                <label htmlFor="is_active" className="text-xs font-bold text-[#1c1917] cursor-pointer">
                  {formData.is_active ? 'Aktif Menerima Pelamar' : 'Ditutup (Tidak Menerima Lamaran)'}
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1c1917] mb-1">
                Gaji Minimum (IDR)
              </label>
              <input
                type="number"
                name="salary_min"
                value={formData.salary_min}
                onChange={handleChange}
                className="fm-input w-full"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1c1917] mb-1">
                Gaji Maksimum (IDR)
              </label>
              <input
                type="number"
                name="salary_max"
                value={formData.salary_max}
                onChange={handleChange}
                className="fm-input w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1c1917] mb-1">
              Deskripsi Pekerjaan *
            </label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="fm-input w-full"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1c1917] mb-1">
              Persyaratan / Kualifikasi
            </label>
            <textarea
              name="requirements"
              rows={3}
              value={formData.requirements}
              onChange={handleChange}
              className="fm-input w-full"
            />
          </div>

          <div className="pt-4 border-t border-[#D9CFC7] flex items-center justify-end gap-3">
            <Link
              to="/dashboard"
              className="fm-btn px-4 py-2 border-[#D9CFC7] bg-[#EFE9E3] text-[#57534e]"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="fm-btn fm-btn-primary px-6 py-2 flex items-center gap-2"
            >
              <Save size={13} />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
