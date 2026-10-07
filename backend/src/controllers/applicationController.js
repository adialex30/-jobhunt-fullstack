const ApplicationModel = require('../models/applicationModel');
const JobModel = require('../models/jobModel');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const VALID_APPLICATION_STATUSES = ['pending', 'reviewed', 'rejected'];

const parseJobId = (rawId) => {
  let id = parseInt(rawId, 10);
  if (isNaN(id) && typeof rawId === 'string' && rawId.toUpperCase().startsWith('AURA-')) {
    const extracted = parseInt(rawId.replace(/^AURA-0*/i, '').replace(/^AURA-/i, ''), 10);
    if (!isNaN(extracted)) id = extracted;
  }
  return id;
};

const formatApplicationData = (raw) => {
  if (!raw) return null;
  return {
    id: raw.id,
    job_id: raw.job_id,
    applicant_id: raw.applicant_id,
    cover_letter: raw.cover_letter || null,
    status: raw.status,
    applied_at: raw.applied_at,
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
    ...(raw.applicant_name ? {
      applicant: {
        id: raw.applicant_id,
        name: raw.applicant_name,
        email: raw.applicant_email,
        member_since: raw.applicant_created_at || null
      }
    } : {}),
    job_title: raw.job_title || raw.title,
    job_company: raw.job_company || raw.company,
    job_location: raw.job_location || raw.location || null,
    job_type: raw.job_type || raw.type,
    applicant_name: raw.applicant_name || null,
    applicant_email: raw.applicant_email || null
  };
};

const ApplicationController = {
  async applyJob(req, res, next) {
    try {
      const jobId = parseJobId(req.params.id);
      if (isNaN(jobId)) {
        return sendError(res, {
          statusCode: 404,
          message: 'Job opening not found.'
        });
      }
      const job = await JobModel.findById(jobId);
      if (!job) {
        return sendError(res, {
          statusCode: 404,
          message: 'Job opening not found.'
        });
      }
      if (!job.is_active) {
        return sendError(res, {
          statusCode: 400,
          message: 'This job opening is closed and no longer accepting applications.'
        });
      }
      const applicantId = req.user.id;
      const alreadyApplied = await ApplicationModel.hasAlreadyApplied(jobId, applicantId);
      if (alreadyApplied) {
        return sendError(res, {
          statusCode: 400,
          message: 'You have already applied for this job.'
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
        message: 'Job application submitted successfully!',
        data: formatApplicationData(newApplication)
      });
    } catch (error) {
      next(error);
    }
  },

  async getMyApplications(req, res, next) {
    try {
      const applicantId = req.user.id;
      const rawApplications = await ApplicationModel.findByApplicantId(applicantId);
      const formattedApplications = rawApplications.map(formatApplicationData);
      return sendSuccess(res, {
        statusCode: 200,
        message: 'Application history loaded successfully.',
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

  async getJobApplicants(req, res, next) {
    try {
      const jobId = parseJobId(req.params.id);
      if (isNaN(jobId)) {
        return sendError(res, {
          statusCode: 404,
          message: 'Job opening not found.'
        });
      }
      const job = await JobModel.findById(jobId);
      if (!job) {
        return sendError(res, {
          statusCode: 404,
          message: 'Job opening not found.'
        });
      }
      if (job.recruiter_id !== req.user.id) {
        return sendError(res, {
          statusCode: 403,
          message: 'Access forbidden. You are not the recruiter for this job.'
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
        applicant_id: app.applicant_id,
        applicant_name: app.applicant_name,
        applicant_email: app.applicant_email
      }));
      return sendSuccess(res, {
        statusCode: 200,
        message: `Applicants for '${job.title}' loaded successfully.`,
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

  async updateApplicationStatus(req, res, next) {
    try {
      const applicationId = parseInt(req.params.id, 10);
      if (isNaN(applicationId)) {
        return sendError(res, {
          statusCode: 400,
          message: 'Invalid application ID.'
        });
      }
      const { status } = req.body;
      if (!status || !VALID_APPLICATION_STATUSES.includes(status.trim().toLowerCase())) {
        return sendError(res, {
          statusCode: 400,
          message: `Invalid status. Must be one of: ${VALID_APPLICATION_STATUSES.join(', ')}`
        });
      }
      const normalizedStatus = status.trim().toLowerCase();
      const application = await ApplicationModel.findById(applicationId);
      if (!application) {
        return sendError(res, {
          statusCode: 404,
          message: 'Job application not found.'
        });
      }
      if (application.job_recruiter_id !== req.user.id) {
        return sendError(res, {
          statusCode: 403,
          message: 'Access forbidden. You are not authorized to update this application.'
        });
      }
      await ApplicationModel.updateStatus(applicationId, normalizedStatus);
      const updatedApplication = await ApplicationModel.findById(applicationId);
      return sendSuccess(res, {
        statusCode: 200,
        message: `Application status updated to '${normalizedStatus}'.`,
        data: formatApplicationData(updatedApplication)
      });
    } catch (error) {
      next(error);
    }
  },

  async getRecruiterDashboard(req, res, next) {
    try {
      const recruiterId = req.user.id;
      const stats = await ApplicationModel.getRecruiterSummary(recruiterId);
      return sendSuccess(res, {
        statusCode: 200,
        message: 'Recruiter dashboard summary loaded successfully.',
        data: {
          total_jobs_posted: stats.total_jobs_posted,
          total_jobs: stats.total_jobs_posted,
          total_applicants: stats.total_applicants,
          status_breakdown: {
            pending: stats.pending_count,
            reviewed: stats.reviewed_count,
            rejected: stats.rejected_count
          },
          pending_count: stats.pending_count,
          reviewed_count: stats.reviewed_count,
          rejected_count: stats.rejected_count
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getApplicationById(req, res, next) {
    try {
      const applicationId = parseInt(req.params.id, 10);
      if (isNaN(applicationId)) {
        return sendError(res, {
          statusCode: 400,
          message: 'Invalid application ID.'
        });
      }
      const application = await ApplicationModel.findById(applicationId);
      if (!application) {
        return sendError(res, {
          statusCode: 404,
          message: 'Job application not found.'
        });
      }
      const isApplicant = req.user && req.user.id === application.applicant_id;
      const isRecruiter = req.user && req.user.id === application.job_recruiter_id;
      if (!isApplicant && !isRecruiter) {
        return sendError(res, {
          statusCode: 403,
          message: 'Access forbidden. You do not have permission to view this application.'
        });
      }
      return sendSuccess(res, {
        statusCode: 200,
        message: 'Job application details loaded successfully.',
        data: formatApplicationData(application)
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = ApplicationController;
