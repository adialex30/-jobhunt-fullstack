const JobModel = require('../models/jobModel');

const VALID_JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship'];

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

      return res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/jobs/stats (Ringkasan statistik untuk landing page)
  async getJobStats(req, res, next) {
    try {
      const stats = await JobModel.getStats();
      return res.status(200).json({
        status: 'success',
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
        return res.status(400).json({
          status: 'error',
          message: 'ID lowongan tidak valid.'
        });
      }

      const job = await JobModel.findById(jobId);
      if (!job) {
        return res.status(404).json({
          status: 'error',
          message: 'Lowongan pekerjaan tidak ditemukan atau sudah ditutup.'
        });
      }

      return res.status(200).json({
        status: 'success',
        data: job
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
        return res.status(400).json({
          status: 'error',
          message: 'Judul pekerjaan (title) wajib diisi.'
        });
      }

      if (!company || !company.trim()) {
        return res.status(400).json({
          status: 'error',
          message: 'Nama perusahaan (company) wajib diisi.'
        });
      }

      if (!type || !VALID_JOB_TYPES.includes(type.trim().toLowerCase())) {
        return res.status(400).json({
          status: 'error',
          message: `Tipe pekerjaan (type) tidak valid. Harus salah satu dari: ${VALID_JOB_TYPES.join(', ')}`
        });
      }

      if (!description || !description.trim()) {
        return res.status(400).json({
          status: 'error',
          message: 'Deskripsi lengkap pekerjaan (description) wajib diisi.'
        });
      }

      const parsedSalaryMin = salary_min ? parseInt(salary_min, 10) : null;
      const parsedSalaryMax = salary_max ? parseInt(salary_max, 10) : null;

      if (parsedSalaryMin && parsedSalaryMax && parsedSalaryMin > parsedSalaryMax) {
        return res.status(400).json({
          status: 'error',
          message: 'Gaji minimum tidak boleh lebih besar dari gaji maksimum.'
        });
      }

      // Fallback recruiterId for local development without auth
      const recruiterId = (req.user && req.user.id) || req.body.recruiter_id || 4;

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

      return res.status(201).json({
        status: 'success',
        message: 'Lowongan pekerjaan baru berhasil diposting!',
        data: newJob
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/jobs/mine (Daftar job milik recruiter yang login / dev fallback)
  async getMyJobs(req, res, next) {
    try {
      const recruiterId = (req.user && req.user.id) || req.query.recruiter_id || 4;
      let myJobs = await JobModel.findByRecruiter(recruiterId);

      // In development mode, if recruiter has no jobs yet, show all active jobs
      if (!myJobs || myJobs.length === 0) {
        const allRes = await JobModel.findAll({ page: 1, limit: 50 });
        myJobs = allRes.jobs;
      }

      return res.status(200).json({
        status: 'success',
        data: myJobs
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/jobs/:id (Update job - auth bypassed for localhost)
  async updateJob(req, res, next) {
    try {
      const jobId = parseInt(req.params.id, 10);
      if (isNaN(jobId)) {
        return res.status(400).json({
          status: 'error',
          message: 'ID lowongan tidak valid.'
        });
      }

      const existingJob = await JobModel.findById(jobId);

      if (!existingJob) {
        return res.status(404).json({
          status: 'error',
          message: 'Lowongan pekerjaan tidak ditemukan.'
        });
      }

      // Use job's actual recruiter_id so update always succeeds in dev bypass mode
      const recruiterId = (req.user && req.user.id) || existingJob.recruiter_id;

      const { type, salary_min, salary_max } = req.body;
      if (type && !VALID_JOB_TYPES.includes(type.trim().toLowerCase())) {
        return res.status(400).json({
          status: 'error',
          message: `Tipe pekerjaan tidak valid. Harus salah satu dari: ${VALID_JOB_TYPES.join(', ')}`
        });
      }

      const parsedMin = salary_min !== undefined ? (salary_min ? parseInt(salary_min, 10) : null) : existingJob.salary_min;
      const parsedMax = salary_max !== undefined ? (salary_max ? parseInt(salary_max, 10) : null) : existingJob.salary_max;

      if (parsedMin && parsedMax && parsedMin > parsedMax) {
        return res.status(400).json({
          status: 'error',
          message: 'Gaji minimum tidak boleh lebih besar dari gaji maksimum.'
        });
      }

      const updateData = { ...req.body };
      if (updateData.type) updateData.type = updateData.type.trim().toLowerCase();
      if (updateData.salary_min !== undefined) updateData.salary_min = parsedMin;
      if (updateData.salary_max !== undefined) updateData.salary_max = parsedMax;

      const success = await JobModel.update(jobId, recruiterId, updateData);
      if (!success) {
        return res.status(400).json({
          status: 'error',
          message: 'Tidak ada perubahan yang diterapkan.'
        });
      }

      const updatedJob = await JobModel.findById(jobId);

      return res.status(200).json({
        status: 'success',
        message: 'Lowongan pekerjaan berhasil diperbarui!',
        data: updatedJob
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/jobs/:id (Hapus job - auth bypassed for localhost)
  async deleteJob(req, res, next) {
    try {
      const jobId = parseInt(req.params.id, 10);
      if (isNaN(jobId)) {
        return res.status(400).json({
          status: 'error',
          message: 'ID lowongan tidak valid.'
        });
      }

      const existingJob = await JobModel.findById(jobId);

      if (!existingJob) {
        return res.status(404).json({
          status: 'error',
          message: 'Lowongan pekerjaan tidak ditemukan.'
        });
      }

      // Use job's actual recruiter_id so delete always succeeds in dev bypass mode
      const recruiterId = (req.user && req.user.id) || existingJob.recruiter_id;

      await JobModel.delete(jobId, recruiterId);

      return res.status(200).json({
        status: 'success',
        message: 'Lowongan pekerjaan berhasil dihapus.'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = JobController;
