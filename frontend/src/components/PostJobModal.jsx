import React, { useState, useEffect } from 'react';
import { X, PlusCircle, CheckCircle, Briefcase, Building, MapPin, DollarSign, FileText, Edit3 } from 'lucide-react';
import { jobService } from '../services/jobService';

export default function PostJobModal({ isOpen, onClose, onJobCreated, onJobUpdated, jobToEdit = null, showToast }) {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Populate form if jobToEdit is passed
  useEffect(() => {
    if (jobToEdit) {
      setFormData({
        title: jobToEdit.title || '',
        company: jobToEdit.company || '',
        location: jobToEdit.location || '',
        type: jobToEdit.type || 'full-time',
        description: jobToEdit.description || '',
        requirements: jobToEdit.requirements || '',
        salary_min: jobToEdit.salary_min !== null && jobToEdit.salary_min !== undefined ? String(jobToEdit.salary_min) : '',
        salary_max: jobToEdit.salary_max !== null && jobToEdit.salary_max !== undefined ? String(jobToEdit.salary_max) : ''
      });
    } else {
      setFormData({
        title: '',
        company: '',
        location: '',
        type: 'full-time',
        description: '',
        requirements: '',
        salary_min: '',
        salary_max: ''
      });
    }
    setErrorMessage('');
  }, [jobToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        location: formData.location ? formData.location.trim() : null,
        type: formData.type,
        description: formData.description.trim(),
        requirements: formData.requirements ? formData.requirements.trim() : null,
        salary_min: formData.salary_min ? parseInt(formData.salary_min, 10) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max, 10) : null
      };

      if (jobToEdit && jobToEdit.id) {
        // PUT /api/jobs/:id (Update job)
        const result = await jobService.updateJob(jobToEdit.id, payload);
        if (showToast) showToast('Lowongan berhasil diperbarui!');
        if (onJobUpdated) onJobUpdated(result.data);
      } else {
        // POST /api/jobs (Posting job baru)
        const result = await jobService.createJob(payload);
        if (showToast) showToast('Lowongan berhasil dipublikasikan ke katalog!');
        if (onJobCreated) onJobCreated(result.data);
      }
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Gagal menyimpan lowongan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = Boolean(jobToEdit && jobToEdit.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1c1917]/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#F9F8F6] border border-[#D9CFC7] max-w-2xl w-full p-4 sm:p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-[#78716c] hover:text-[#1c1917] p-1.5 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 text-[#6b5c47] mb-1 pr-6">
          {isEditMode ? <Edit3 size={16} /> : <Briefcase size={16} />}
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold truncate">
            {isEditMode ? 'Recruiter Edit Portal' : 'Recruiter Dispatch Portal'}
          </span>
        </div>

        <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#1c1917] tracking-tight mb-1.5">
          {isEditMode ? 'Edit Lowongan Pekerjaan' : 'Pasang Lowongan Baru'}
        </h2>
        <p className="font-sans text-xs text-[#57534e] mb-5 sm:mb-6 leading-relaxed">
          {isEditMode
            ? 'Perbarui detail lowongan pekerjaan yang Anda kelola secara langsung ke database.'
            : 'Publikasikan posisi karir terkurasi langsung ke jaringan arsip talent forcemajeure.bzh.'}
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#1c1917] mb-1 uppercase tracking-wider">
                Judul Pekerjaan *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Lead Spatial Architect"
                className="fm-input w-full"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#1c1917] mb-1 uppercase tracking-wider">
                Perusahaan *
              </label>
              <input
                type="text"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Kinetic Labs Inc."
                className="fm-input w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#1c1917] mb-1 uppercase tracking-wider">
                Lokasi / Mode
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Jakarta • Hybrid / Remote"
                className="fm-input w-full"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#1c1917] mb-1 uppercase tracking-wider">
                Tipe Pekerjaan *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="fm-input w-full cursor-pointer bg-[#F9F8F6]"
              >
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#1c1917] mb-1 uppercase tracking-wider">
                Gaji Min (Rp / bln)
              </label>
              <input
                type="number"
                name="salary_min"
                value={formData.salary_min}
                onChange={handleChange}
                placeholder="e.g. 15000000"
                className="fm-input w-full"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#1c1917] mb-1 uppercase tracking-wider">
                Gaji Max (Rp / bln)
              </label>
              <input
                type="number"
                name="salary_max"
                value={formData.salary_max}
                onChange={handleChange}
                placeholder="e.g. 25000000"
                className="fm-input w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#1c1917] mb-1 uppercase tracking-wider">
              Deskripsi Pekerjaan *
            </label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Jelaskan peran, tanggung jawab, dan dampak dari posisi ini..."
              className="fm-input w-full"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#1c1917] mb-1 uppercase tracking-wider">
              Kualifikasi yang Dibutuhkan
            </label>
            <textarea
              name="requirements"
              rows={3}
              value={formData.requirements}
              onChange={handleChange}
              placeholder="e.g. 5+ tahun pengalaman, keahlian arsitektur sistem, portofolio desain..."
              className="fm-input w-full"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 border-t border-[#D9CFC7]">
            <button
              type="button"
              onClick={onClose}
              className="fm-btn px-4 py-2 text-[#57534e] hover:text-[#1c1917] border-[#D9CFC7] bg-[#EFE9E3] justify-center"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="fm-btn fm-btn-primary px-6 py-2 flex items-center justify-center gap-2"
            >
              {isEditMode ? <CheckCircle size={14} /> : <PlusCircle size={14} />}
              <span>{isSubmitting ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Posting Lowongan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
