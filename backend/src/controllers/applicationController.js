const ApplicationModel = require('../models/applicationModel');
const JobModel = require('../models/jobModel');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const VALID_APPLICATION_STATUSES = ['pending', 'reviewed', 'rejected'];

/**
 * Format satu row lamaran agar lebih rapih & terstruktur
 */
const formatApplicationData = (raw) => {
  if (!raw) return null;

  return {
    id: raw.id,
    job_id: raw.job_id,
    applicant_id: raw.applicant_id,
    cover_letter: raw.cover_letter || null,
    status: raw.status,
    applied_at: raw.applied_at,

    // Nested Job Information
    job: {
      id: raw.job_id,
      title: raw.job_title || raw.title,
      company: raw.job_company || raw.company,
      location: raw.job_location || raw.location || null,
      type: raw.job_type || raw.type,
      salary: {
        min: raw.job_salary_min !== undefined ? raw.job_salary_min : raw.salary_min,
        max: raw.job_salary_max !== undefined ? raw.job_salary_max : raw.salary_max
      },
      is_active: raw.job_is_active !== undefined ? Boolean(raw.job_is_active) : (raw.is_active !== undefined ? Boolean(raw.is_active) : true),
      recruiter: {
        name: raw.recruiter_name || null,
        email: raw.recruiter_email || null
      }
    },

    // Nested Applicant Information (if available)
    ...(raw.applicant_name ? {
      applicant: {
        id: raw.applicant_id,
        name: raw.applicant_name,
        email: raw.applicant_email,
        member_since: raw.applicant_created_at || null
      }
    } : {}),

    // Backward-compatibility aliases
    job_title: raw.job_title || raw.title,
    job_company: raw.job_company || raw.company,
    job_location: raw.job_location || raw.location || null,
    job_type: raw.job_type || raw.type,
    applicant_name: raw.applicant_name || null,
    applicant_email: raw.applicant_email || null
  };
};

const ApplicationController = {
  // POST /api/jobs/:id/apply - Lamar pekerjaan (Auth: Job Seeker)
  async applyJob(req, res, next) {
    try {
      const jobId = parseInt(req.params.id, 10);
      if (isNaN(jobId)) {
        return sendError(res, {
          statusCode: 400,
          message: 'ID lowongan tidak valid. Harap berikan nomor ID yang benar.'
        });
      }

      // Check if job exists
      const job = await JobModel.findById(jobId);
      if (!job) {
        return sendError(res, {
          statusCode: 404,
          message: 'Lowongan pekerjaan tidak ditemukan.'
        });
      }

      // Check if job is still active
      if (!job.is_active) {
        return sendError(res, {
          statusCode: 400,
          message: 'Lowongan pekerjaan ini sudah ditutup atau tidak aktif menerima lamaran baru.'
        });
      }

      const applicantId = req.user.id;

      // Check if user has already applied
      const alreadyApplied = await ApplicationModel.hasAlreadyApplied(jobId, applicantId);
      if (alreadyApplied) {
        return sendError(res, {
          statusCode: 400,
          message: 'Anda sudah melamar pekerjaan ini sebelumnya. Tidak diperkenankan melamar ganda.'
        });
      }

      const { cover_letter } = req.body;

      const newApplicationId = await ApplicationModel.create({
        job_id: jobId,
        applicant_id: applicantId,
        cover_letter: cover_letter ? cover_letter.trim() : null
      });

      const newApplication = await ApplicationModel.findById(newApplicationId);

      return sendSuccess(res, {
        statusCode: 201,
        message: 'Lamaran pekerjaan berhasil dikirim ke recruiter!',
        data: formatApplicationData(newApplication)
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/applications/mine - Riwayat lamaran user yang login (Auth: Job Seeker)
  async getMyApplications(req, res, next) {
    try {
      const applicantId = req.user.id;
      const rawApplications = await ApplicationModel.findByApplicantId(applicantId);
      const formattedApplications = rawApplications.map(formatApplicationData);

      return sendSuccess(res, {
        statusCode: 200,
        message: 'Riwayat lamaran pekerjaan berhasil dimuat.',
        data: formattedApplications,
        meta: {
          total_applications: formattedApplications.length,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/jobs/:id/applicants - Daftar pelamar untuk job tertentu (Auth: Recruiter)
  async getJobApplicants(req, res, next) {
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
          message: 'Lowongan pekerjaan tidak ditemukan.'
        });
      }

      // Check if current recruiter owns this job
      if (job.recruiter_id !== req.user.id) {
        return sendError(res, {
          statusCode: 403,
          message: 'Akses terlarang! Anda bukan pemilik dari lowongan pekerjaan ini.'
        });
      }

      const rawApplicants = await ApplicationModel.findByJobId(jobId);
      const formattedApplicants = rawApplicants.map((app) => ({
        id: app.id,
        job_id: app.job_id,
        cover_letter: app.cover_letter || null,
        status: app.status,
        applied_at: app.applied_at,
        applicant: {
          id: app.applicant_id,
          name: app.applicant_name,
          email: app.applicant_email,
          member_since: app.applicant_created_at
        },
        // Flat compatibility fields
        applicant_id: app.applicant_id,
        applicant_name: app.applicant_name,
        applicant_email: app.applicant_email
      }));

      return sendSuccess(res, {
        statusCode: 200,
        message: `Daftar pelamar untuk lowongan '${job.title}' berhasil dimuat.`,
        data: formattedApplicants,
        meta: {
          job_id: jobId,
          job_title: job.title,
          total_applicants: formattedApplicants.length
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/applications/:id - Update status lamaran (Auth: Recruiter)
  async updateApplicationStatus(req, res, next) {
    try {
      const applicationId = parseInt(req.params.id, 10);
      if (isNaN(applicationId)) {
        return sendError(res, {
          statusCode: 400,
          message: 'ID lamaran tidak valid.'
        });
      }

      const { status } = req.body;
      if (!status || !VALID_APPLICATION_STATUSES.includes(status.trim().toLowerCase())) {
        return sendError(res, {
          statusCode: 400,
          message: `Status tidak valid. Harus salah satu dari: ${VALID_APPLICATION_STATUSES.join(', ')}`
        });
      }

      const normalizedStatus = status.trim().toLowerCase();

      const application = await ApplicationModel.findById(applicationId);
      if (!application) {
        return sendError(res, {
          statusCode: 404,
          message: 'Lamaran pekerjaan tidak ditemukan.'
        });
      }

      // Verify that this recruiter is the owner of the job being applied to
      if (application.job_recruiter_id !== req.user.id) {
        return sendError(res, {
          statusCode: 403,
          message: 'Akses terlarang! Anda tidak berwenang memperbarui status lamaran untuk lowongan ini.'
        });
      }

      await ApplicationModel.updateStatus(applicationId, normalizedStatus);
      const updatedApplication = await ApplicationModel.findById(applicationId);

      return sendSuccess(res, {
        statusCode: 200,
        message: `Status lamaran berhasil diperbarui menjadi '${normalizedStatus}'.`,
        data: formatApplicationData(updatedApplication)
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/applications/dashboard - Ringkasan Recruiter: total jobs posted, total pelamar
  async getRecruiterDashboard(req, res, next) {
    try {
      const recruiterId = req.user.id;
      const stats = await ApplicationModel.getRecruiterSummary(recruiterId);

      return sendSuccess(res, {
        statusCode: 200,
        message: 'Ringkasan data dashboard recruiter berhasil dimuat.',
        data: {
          total_jobs_posted: stats.total_jobs_posted,
          total_applicants: stats.total_applicants,
          status_breakdown: {
            pending: stats.pending_count,
            reviewed: stats.reviewed_count,
            rejected: stats.rejected_count
          },
          // Flat compatibility
          pending_count: stats.pending_count,
          reviewed_count: stats.reviewed_count,
          rejected_count: stats.rejected_count
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/applications/:id - Detail satu lamaran
  async getApplicationById(req, res, next) {
    try {
      const applicationId = parseInt(req.params.id, 10);
      if (isNaN(applicationId)) {
        return sendError(res, {
          statusCode: 400,
          message: 'ID lamaran tidak valid.'
        });
      }

      const application = await ApplicationModel.findById(applicationId);
      if (!application) {
        return sendError(res, {
          statusCode: 404,
          message: 'Lamaran pekerjaan tidak ditemukan.'
        });
      }

      // Allow access if applicant or recruiter of the job
      const isApplicant = req.user && req.user.id === application.applicant_id;
      const isRecruiter = req.user && req.user.id === application.job_recruiter_id;

      if (!isApplicant && !isRecruiter) {
        return sendError(res, {
          statusCode: 403,
          message: 'Akses terlarang! Anda tidak memiliki izin untuk melihat lamaran ini.'
        });
      }

      return sendSuccess(res, {
        statusCode: 200,
        message: 'Detail data lamaran pekerjaan berhasil dimuat.',
        data: formatApplicationData(application)
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = ApplicationController;
