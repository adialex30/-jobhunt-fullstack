import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, ArrowLeft, Send, AlertCircle, Building2, MapPin, DollarSign, FileText } from 'lucide-react';
import { useJobs } from '../hooks/useJobs';

const JOB_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' }
];

export default function CreateJobPage({ showToast }) {
  const { createJob } = useJobs();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    description: '',
    requirements: '',
    salary_min: '',
    salary_max: ''
  });

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim() || !formData.company.trim() || !formData.description.trim()) {
      setError('Judul lowongan, nama perusahaan, dan deskripsi pekerjaan wajib diisi.');
      return;
    }

    const minSal = formData.salary_min ? parseInt(formData.salary_min, 10) : null;
    const maxSal = formData.salary_max ? parseInt(formData.salary_max, 10) : null;

    if (minSal && maxSal && minSal > maxSal) {
      setError('Gaji minimum tidak boleh lebih besar dari gaji maksimum.');
      return;
    }

    try {
      setIsSubmitting(true);
      await createJob({
        ...formData,
        salary_min: minSal,
        salary_max: maxSal
      });

      if (showToast) showToast('Lowongan pekerjaan baru berhasil diposting!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Gagal memposting lowongan pekerjaan.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <span>Posting Lowongan</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-[#1c1917]">
            Buat Lowongan Pekerjaan Baru
          </h1>
          <p className="font-serif italic text-xs text-[#57534e] mt-1">
            Informasi ini akan langsung tampil di katalog publik lowongan terkurasi.
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
              placeholder="cth. Senior Fullstack Engineer"
              value={formData.title}
              onChange={handleChange}
              className="fm-input w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1c1917] mb-1">
                Nama Perusahaan / Studio *
              </label>
              <input
                type="text"
                name="company"
                required
                placeholder="cth. Kinetic Spatial Labs"
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
                placeholder="cth. Jakarta (Hybrid) atau Remote"
                value={formData.location}
                onChange={handleChange}
                className="fm-input w-full"
              />
            </div>
          </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1c1917] mb-1">
                Gaji Minimum (IDR / Bulan)
              </label>
              <input
                type="number"
                name="salary_min"
                placeholder="cth. 15000000"
                value={formData.salary_min}
                onChange={handleChange}
                className="fm-input w-full"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1c1917] mb-1">
                Gaji Maksimum (IDR / Bulan)
              </label>
              <input
                type="number"
                name="salary_max"
                placeholder="cth. 25000000"
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
              placeholder="Jelaskan peran, tanggung jawab, dan misi posisi ini..."
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
              placeholder="Kualifikasi yang diharapkan, keahlian teknis, dan portofolio..."
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
              <Send size={13} />
              <span>{isSubmitting ? 'Menerbitkan...' : 'Publikasikan Lowongan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
