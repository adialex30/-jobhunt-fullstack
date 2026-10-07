const JobModel = require('../models/jobModel');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const VALID_JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship'];

const parseJobId = (rawId) => {
  let id = parseInt(rawId, 10);
  if (isNaN(id) && typeof rawId === 'string' && rawId.toUpperCase().startsWith('AURA-')) {
    const extracted = parseInt(rawId.replace(/^AURA-0*/i, '').replace(/^AURA-/i, ''), 10);
    if (!isNaN(extracted)) id = extracted;
  }
  return id;
};

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
    recruiter_name: raw.recruiter_name || null,
    recruiter_email: raw.recruiter_email || null,
    applicants_count: Number(raw.applicants_count) || 0,
    total_applicants: Number(raw.applicants_count) || 0
  };
};

const JobController = {
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
        message: 'Job openings retrieved successfully.',
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

  async getJobStats(req, res, next) {
    try {
      const stats = await JobModel.getStats();
      return sendSuccess(res, {
        statusCode: 200,
        message: 'Job statistics retrieved successfully.',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  },

  async getJobById(req, res, next) {
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
          message: 'Job opening not found or has been closed.'
        });
      }
      return sendSuccess(res, {
        statusCode: 200,
        message: 'Job opening details retrieved successfully.',
        data: formatJobData(job)
      });
    } catch (error) {
      next(error);
    }
  },

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
      if (!title || !title.trim()) {
        return sendError(res, {
          statusCode: 400,
          message: 'Job title is required.'
        });
      }
      if (!company || !company.trim()) {
        return sendError(res, {
          statusCode: 400,
          message: 'Company name is required.'
        });
      }
      if (!type || !VALID_JOB_TYPES.includes(type.trim().toLowerCase())) {
        return sendError(res, {
          statusCode: 400,
          message: `Invalid job type. Must be one of: ${VALID_JOB_TYPES.join(', ')}`
        });
      }
      if (!description || !description.trim()) {
        return sendError(res, {
          statusCode: 400,
          message: 'Job description is required.'
        });
      }
      const parsedSalaryMin = salary_min ? parseInt(salary_min, 10) : null;
      const parsedSalaryMax = salary_max ? parseInt(salary_max, 10) : null;
      if (parsedSalaryMin && parsedSalaryMax && parsedSalaryMin > parsedSalaryMax) {
        return sendError(res, {
          statusCode: 400,
          message: 'Minimum salary cannot be greater than maximum salary.'
        });
      }
      if (!req.user || !req.user.id) {
        return sendError(res, {
          statusCode: 401,
          message: 'Authentication required to post a job.'
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
        message: 'New job opening posted successfully!',
        data: formatJobData(newJob)
      });
    } catch (error) {
      next(error);
    }
  },

  async getMyJobs(req, res, next) {
    try {
      if (!req.user || !req.user.id) {
        return sendError(res, {
          statusCode: 401,
          message: 'Authentication required to view your jobs.'
        });
      }
      const recruiterId = req.user.id;
      const myJobs = (await JobModel.findByRecruiter(recruiterId)) || [];
      const formatted = myJobs.map(formatJobData);
      return sendSuccess(res, {
        statusCode: 200,
        message: 'Your posted jobs retrieved successfully.',
        data: formatted,
        meta: {
          total: formatted.length
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async updateJob(req, res, next) {
    try {
      const jobId = parseJobId(req.params.id);
      if (isNaN(jobId)) {
        return sendError(res, {
          statusCode: 404,
          message: 'Job opening not found.'
        });
      }
      const existingJob = await JobModel.findById(jobId);
      if (!existingJob) {
        return sendError(res, {
          statusCode: 404,
          message: 'Job opening not found.'
        });
      }
      if (!req.user || req.user.id !== existingJob.recruiter_id) {
        return sendError(res, {
          statusCode: 403,
          message: 'Access forbidden. You are not authorized to update this job opening.'
        });
      }
      const recruiterId = req.user.id;
      const { type, salary_min, salary_max } = req.body;
      if (type && !VALID_JOB_TYPES.includes(type.trim().toLowerCase())) {
        return sendError(res, {
          statusCode: 400,
          message: `Invalid job type. Must be one of: ${VALID_JOB_TYPES.join(', ')}`
        });
      }
      const parsedMin = salary_min !== undefined ? (salary_min ? parseInt(salary_min, 10) : null) : existingJob.salary_min;
      const parsedMax = salary_max !== undefined ? (salary_max ? parseInt(salary_max, 10) : null) : existingJob.salary_max;
      if (parsedMin && parsedMax && parsedMin > parsedMax) {
        return sendError(res, {
          statusCode: 400,
          message: 'Minimum salary cannot be greater than maximum salary.'
        });
      }
      const updateData = { ...req.body };
      if (updateData.type) updateData.type = updateData.type.trim().toLowerCase();
      if (updateData.salary_min !== undefined) updateData.salary_min = parsedMin;
      if (updateData.salary_max !== undefined) updateData.salary_max = parsedMax;
      await JobModel.update(jobId, recruiterId, updateData);
      const updatedJob = await JobModel.findById(jobId);
      return sendSuccess(res, {
        statusCode: 200,
        message: 'Job opening updated successfully!',
        data: formatJobData(updatedJob)
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteJob(req, res, next) {
    try {
      const jobId = parseJobId(req.params.id);
      if (isNaN(jobId)) {
        return sendError(res, {
          statusCode: 404,
          message: 'Job opening not found.'
        });
      }
      const existingJob = await JobModel.findById(jobId);
      if (!existingJob) {
        return sendError(res, {
          statusCode: 404,
          message: 'Job opening not found.'
        });
      }
      if (!req.user || req.user.id !== existingJob.recruiter_id) {
        return sendError(res, {
          statusCode: 403,
          message: 'Access forbidden. You are not authorized to delete this job opening.'
        });
      }
      const isDeleted = await JobModel.delete(jobId, req.user.id);
      if (!isDeleted) {
        return sendError(res, {
          statusCode: 400,
          message: 'Failed to delete job opening.'
        });
      }
      return sendSuccess(res, {
        statusCode: 200,
        message: 'Job opening deleted successfully.'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = JobController;
