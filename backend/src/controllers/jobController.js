const JobModel = require('../models/jobModel');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const VALID_JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship'];

/**
 * Format data objek lowongan pekerjaan agar rapih & konsisten
 */
const formatJobData = (raw) => {
  if (!raw) return null;
  return {
    id: raw.id,
    title: raw.title,
    company: raw.company,
    location: raw.location || null,
    type: raw.type,
    description: raw.description,
    requirements: raw.requirements || null,
    salary_min: raw.salary_min !== undefined ? raw.salary_min : null,
    salary_max: raw.salary_max !== undefined ? raw.salary_max : null,
    salary: {
      min: raw.salary_min !== undefined ? raw.salary_min : null,
      max: raw.salary_max !== undefined ? raw.salary_max : null
    },
    is_active: Boolean(raw.is_active),
    created_at: raw.created_at,
    recruiter_id: raw.recruiter_id,
    recruiter: {
      id: raw.recruiter_id,
      name: raw.recruiter_name || null,
      email: raw.recruiter_email || null
    },
    // Total pelamar
    total_applicants: raw.total_applicants !== undefined ? parseInt(raw.total_applicants, 10) : 0,
    applicants_count: raw.total_applicants !== undefined ? parseInt(raw.total_applicants, 10) : 0,
    // Compatibility fields
    recruiter_name: raw.recruiter_name || null,
    recruiter_email: raw.recruiter_email || null
  };
};

const JobController = {
  // GET /api/jobs (Semua job aktif dengan search, filter, pagination)
  async getAllJobs(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        keyword = '',
        type = '',
        location = ''
      } = req.query;

      const pageNumber = Math.max(1, parseInt(page, 10) || 1);
      const limitNumber = Math.max(1, Math.min(50, parseInt(limit, 10) || 10));

      const result = await JobModel.findAll({
        page: pageNumber,
        limit: limitNumber,
        keyword,
        type,
        location
      });

      const formattedJobs = result.jobs.map(formatJobData);

      return sendSuccess(res, {
        statusCode: 200,
        message: 'Daftar lowongan pekerjaan berhasil dimuat.',
        data: {
          jobs: formattedJobs,
          totalJobs: result.totalJobs,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          limit: result.limit
        },
        pagination: {
          currentPage: result.currentPage,
          totalPages: result.totalPages,
          totalJobs: result.totalJobs,
          limit: result.limit,
          hasNextPage: result.currentPage < result.totalPages,
          hasPrevPage: result.currentPage > 1
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/jobs/stats (Ringkasan statistik untuk landing page)
  async getJobStats(req, res, next) {
    try {
      const stats = await JobModel.getStats();
      return sendSuccess(res, {
        statusCode: 200,
        message: 'Statistik lowongan pekerjaan berhasil dimuat.',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/jobs/:id (Detail satu job)
  async getJobById(req, res, next) {
    try {
      const jobId = parseInt(req.params.id, 10);
      if (isNaN(jobId)) {
        return sendError(res, {
          statusCode: 400,
          message: 'ID lowongan tidak valid.'
        });
      }

      const job = await JobModel.findById(jobId);
      if (!job) {
        return sendError(res, {
          statusCode: 404,
          message: 'Lowongan pekerjaan tidak ditemukan atau sudah ditutup.'
        });
      }

      return sendSuccess(res, {
        statusCode: 200,
        message: 'Detail lowongan pekerjaan berhasil dimuat.',
        data: formatJobData(job)
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/jobs (Posting job baru, Auth: Recruiter)
  async createJob(req, res, next) {
    try {
      const {
        title,
        company,
        location,
        type,
        description,
        requirements,
        salary_min,
        salary_max
      } = req.body;

      // Validation
      if (!title || !title.trim()) {
        return sendError(res, {
          statusCode: 400,
          message: 'Judul pekerjaan (title) wajib diisi.'
        });
      }

      if (!company || !company.trim()) {
        return sendError(res, {
          statusCode: 400,
          message: 'Nama perusahaan (company) wajib diisi.'
        });
      }

      if (!type || !VALID_JOB_TYPES.includes(type.trim().toLowerCase())) {
        return sendError(res, {
          statusCode: 400,
          message: `Tipe pekerjaan (type) tidak valid. Harus salah satu dari: ${VALID_JOB_TYPES.join(', ')}`
        });
      }

      if (!description || !description.trim()) {
        return sendError(res, {
          statusCode: 400,
          message: 'Deskripsi lengkap pekerjaan (description) wajib diisi.'
        });
      }

      const parsedSalaryMin = salary_min ? parseInt(salary_min, 10) : null;
      const parsedSalaryMax = salary_max ? parseInt(salary_max, 10) : null;

      if (parsedSalaryMin && parsedSalaryMax && parsedSalaryMin > parsedSalaryMax) {
        return sendError(res, {
          statusCode: 400,
          message: 'Gaji minimum tidak boleh lebih besar dari gaji maksimum.'
        });
      }

      const recruiterId = req.user.id;

      const createdJobId = await JobModel.create({
        recruiter_id: recruiterId,
        title: title.trim(),
        company: company.trim(),
        location: location ? location.trim() : null,
        type: type.trim().toLowerCase(),
        description: description.trim(),
        requirements: requirements ? requirements.trim() : null,
        salary_min: parsedSalaryMin,
        salary_max: parsedSalaryMax,
        is_active: true
      });

      const newJob = await JobModel.findById(createdJobId);

      return sendSuccess(res, {
        statusCode: 201,
        message: 'Lowongan pekerjaan baru berhasil diposting!',
        data: formatJobData(newJob)
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/jobs/mine (Daftar job milik recruiter yang login)
  async getMyJobs(req, res, next) {
    try {
      const recruiterId = req.user.id;
      const myJobs = await JobModel.findByRecruiter(recruiterId);
      const formatted = myJobs.map(formatJobData);

      return sendSuccess(res, {
        statusCode: 200,
        message: 'Daftar lowongan pekerjaan Anda berhasil dimuat.',
        data: formatted,
        meta: {
          total: formatted.length
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/jobs/:id (Update job - hanya milik sendiri)
  async updateJob(req, res, next) {
    try {
      const jobId = parseInt(req.params.id, 10);
      if (isNaN(jobId)) {
        return sendError(res, {
          statusCode: 400,
          message: 'ID lowongan tidak valid.'
        });
      }

      const existingJob = await JobModel.findById(jobId);

      if (!existingJob) {
        return sendError(res, {
          statusCode: 404,
          message: 'Lowongan pekerjaan tidak ditemukan.'
        });
      }

      // Check ownership
      if (existingJob.recruiter_id !== req.user.id) {
        return sendError(res, {
          statusCode: 403,
          message: 'Akses terlarang! Anda hanya dapat mengubah lowongan pekerjaan milik sendiri.'
        });
      }

      const recruiterId = req.user.id;

      const { type, salary_min, salary_max } = req.body;
      if (type && !VALID_JOB_TYPES.includes(type.trim().toLowerCase())) {
        return sendError(res, {
          statusCode: 400,
          message: `Tipe pekerjaan tidak valid. Harus salah satu dari: ${VALID_JOB_TYPES.join(', ')}`
        });
      }

      const parsedMin = salary_min !== undefined ? (salary_min ? parseInt(salary_min, 10) : null) : existingJob.salary_min;
      const parsedMax = salary_max !== undefined ? (salary_max ? parseInt(salary_max, 10) : null) : existingJob.salary_max;

      if (parsedMin && parsedMax && parsedMin > parsedMax) {
        return sendError(res, {
          statusCode: 400,
          message: 'Gaji minimum tidak boleh lebih besar dari gaji maksimum.'
        });
      }

      const updateData = { ...req.body };
      if (updateData.type) updateData.type = updateData.type.trim().toLowerCase();
      if (updateData.salary_min !== undefined) updateData.salary_min = parsedMin;
      if (updateData.salary_max !== undefined) updateData.salary_max = parsedMax;

      const success = await JobModel.update(jobId, recruiterId, updateData);
      if (!success) {
        return sendError(res, {
          statusCode: 400,
          message: 'Tidak ada perubahan yang diterapkan pada lowongan.'
        });
      }

      const updatedJob = await JobModel.findById(jobId);

      return sendSuccess(res, {
        statusCode: 200,
        message: 'Lowongan pekerjaan berhasil diperbarui!',
        data: formatJobData(updatedJob)
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/jobs/:id (Hapus job)
  async deleteJob(req, res, next) {
    try {
      const jobId = parseInt(req.params.id, 10);
      if (isNaN(jobId)) {
        return sendError(res, {
          statusCode: 400,
          message: 'ID lowongan tidak valid.'
        });
      }

      const existingJob = await JobModel.findById(jobId);

      if (!existingJob) {
        return sendError(res, {
          statusCode: 404,
          message: 'Lowongan pekerjaan tidak ditemukan.'
        });
      }

      // Check ownership
      if (existingJob.recruiter_id !== req.user.id) {
        return sendError(res, {
          statusCode: 403,
          message: 'Akses terlarang! Anda hanya dapat menghapus lowongan pekerjaan milik sendiri.'
        });
      }

      const recruiterId = req.user.id;
      await JobModel.delete(jobId, recruiterId);

      return sendSuccess(res, {
        statusCode: 200,
        message: 'Lowongan pekerjaan berhasil dihapus.'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = JobController;
