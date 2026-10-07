import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Trash2 } from 'lucide-react';
import { jobService } from '../services/jobService';

export default function JobEditPage({ showToast }) {
  const { id } = useParams();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const res = await jobService.getJobById(id);
        const j = res.data;
        if (j) {
          setFormData({
            title: j.title || '',
            company: j.company || '',
            location: j.location || '',
            type: j.type || 'full-time',
            description: j.description || '',
            requirements: j.requirements || '',
            salary_min: j.salary_min !== null && j.salary_min !== undefined ? String(j.salary_min) : '',
            salary_max: j.salary_max !== null && j.salary_max !== undefined ? String(j.salary_max) : '',
            is_active: j.is_active !== undefined ? Boolean(j.is_active) : true
          });
        }
      } catch (err) {
        console.error('Error fetching job for edit:', err);
        setErrorMessage('Failed to load job for editing or unauthorized.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.title.trim()) {
      setErrorMessage('Job title is required.');
      return;
    }
    if (!formData.company.trim()) {
      setErrorMessage('Company name is required.');
      return;
    }
    if (!formData.description.trim()) {
      setErrorMessage('Job description is required.');
      return;
    }

    if (formData.salary_min && formData.salary_max) {
      if (Number(formData.salary_min) > Number(formData.salary_max)) {
        setErrorMessage('Minimum salary cannot exceed maximum salary.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        location: formData.location.trim() || null,
        type: formData.type,
        description: formData.description.trim(),
        requirements: formData.requirements.trim() || null,
        salary_min: formData.salary_min ? Number(formData.salary_min) : null,
        salary_max: formData.salary_max ? Number(formData.salary_max) : null,
        is_active: formData.is_active
      };

      await jobService.updateJob(id, payload);
      if (showToast) {
        showToast('Job opening updated successfully!');
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Error updating job:', err);
      setErrorMessage(err.message || 'Failed to update job.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-20 text-center font-mono text-xs text-[#78716c]">
        <div className="w-6 h-6 border-2 border-[#1c1917] border-t-transparent animate-spin mx-auto mb-3"></div>
        <span>Loading job data...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-mono">
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs text-[#78716c] hover:text-[#1c1917] transition-colors mb-3"
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1c1917]">
          Edit Job Opening
        </h1>
        <p className="text-xs text-[#57534e] mt-1">
          Update compensation details, description, or job status (ID #{id}).
        </p>
      </div>

      <div className="bg-[#F9F8F6] border border-[#D9CFC7] p-6 sm:p-8 shadow-sm">
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1c1917] mb-1.5">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-[#EFE9E3] border border-[#D9CFC7] focus:border-[#1c1917] text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1c1917] mb-1.5">
                Company Name *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-[#EFE9E3] border border-[#D9CFC7] focus:border-[#1c1917] text-xs outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1c1917] mb-1.5">
                Job Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#EFE9E3] border border-[#D9CFC7] focus:border-[#1c1917] text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1c1917] mb-1.5">
                Employment Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#EFE9E3] border border-[#D9CFC7] focus:border-[#1c1917] text-xs outline-none"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1c1917] mb-1.5">
                Minimum Salary (IDR / Month)
              </label>
              <input
                type="number"
                name="salary_min"
                value={formData.salary_min}
                onChange={handleChange}
                min="0"
                step="500000"
                className="w-full px-3 py-2 bg-[#EFE9E3] border border-[#D9CFC7] focus:border-[#1c1917] text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1c1917] mb-1.5">
                Maximum Salary (IDR / Month)
              </label>
              <input
                type="number"
                name="salary_max"
                value={formData.salary_max}
                onChange={handleChange}
                min="0"
                step="500000"
                className="w-full px-3 py-2 bg-[#EFE9E3] border border-[#D9CFC7] focus:border-[#1c1917] text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1c1917] mb-1.5">
              Job Description *
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-[#EFE9E3] border border-[#D9CFC7] focus:border-[#1c1917] text-xs outline-none resize-y"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1c1917] mb-1.5">
              Requirements &amp; Qualifications
            </label>
            <textarea
              name="requirements"
              rows={3}
              value={formData.requirements}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#EFE9E3] border border-[#D9CFC7] focus:border-[#1c1917] text-xs outline-none resize-y"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 text-[#1c1917] border-[#D9CFC7] rounded-none focus:ring-0"
            />
            <label htmlFor="is_active" className="text-xs text-[#1c1917] font-bold">
              Active Job (Visible and open for applications)
            </label>
          </div>

          <div className="pt-4 border-t border-[#D9CFC7] flex items-center justify-end gap-3">
            <Link
              to="/dashboard"
              className="px-4 py-2 border border-[#D9CFC7] text-[#57534e] hover:text-[#1c1917] text-xs font-bold uppercase tracking-wider"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#1c1917] text-[#F9F8F6] text-xs font-bold uppercase tracking-wider hover:bg-[#C9B59C] hover:text-[#1c1917] transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
