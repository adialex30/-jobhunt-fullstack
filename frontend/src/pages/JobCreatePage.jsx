import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, AlertCircle, Building2, MapPin, DollarSign, FileText } from 'lucide-react';
import { jobService } from '../services/jobService';

const VALID_JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship'];

export default function JobCreatePage({ showToast }) {
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        salary_max: formData.salary_max ? Number(formData.salary_max) : null
      };

      const result = await jobService.createJob(payload);
      if (showToast) {
        showToast('New job opening published successfully!');
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating job:', err);
      setErrorMessage(err.message || 'Failed to post job.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          Post a New Job
        </h1>
        <p className="text-xs text-[#57534e] mt-1">
          Publish an open position to attract top talent to your company.
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
                placeholder="e.g. Senior Fullstack Engineer"
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
                placeholder="e.g. Acme Tech Studio"
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
                placeholder="e.g. Jakarta, ID / Remote"
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
                placeholder="e.g. 10000000"
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
                placeholder="e.g. 18000000"
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
              placeholder="Describe the role, key responsibilities, and team expectations..."
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
              placeholder="e.g. 3+ years experience with React, TypeScript, and Node.js..."
              className="w-full px-3 py-2 bg-[#EFE9E3] border border-[#D9CFC7] focus:border-[#1c1917] text-xs outline-none resize-y"
            />
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
              {isSubmitting ? 'Publishing...' : 'Publish Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
