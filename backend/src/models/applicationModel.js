const db = require('../config/db');

const ApplicationModel = {
  // Create new application
  async create({ job_id, applicant_id, cover_letter }) {
    const query = `
      INSERT INTO applications (job_id, applicant_id, cover_letter, status)
      VALUES (?, ?, ?, 'pending')
    `;
    const [result] = await db.query(query, [
      job_id,
      applicant_id,
      cover_letter || null
    ]);
    return result.insertId;
  },

  // Check if applicant has already applied to this job
  async hasAlreadyApplied(job_id, applicant_id) {
    const query = `
      SELECT id FROM applications
      WHERE job_id = ? AND applicant_id = ?
      LIMIT 1
    `;
    const [rows] = await db.query(query, [job_id, applicant_id]);
    return rows.length > 0;
  },

  // Find single application by id with job and applicant info
  async findById(id) {
    const query = `
      SELECT 
        a.id,
        a.job_id,
        a.applicant_id,
        a.cover_letter,
        a.status,
        a.applied_at,
        j.title AS job_title,
        j.company AS job_company,
        j.location AS job_location,
        j.type AS job_type,
        j.salary_min AS job_salary_min,
        j.salary_max AS job_salary_max,
        j.recruiter_id AS job_recruiter_id,
        u.name AS applicant_name,
        u.email AS applicant_email
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON a.applicant_id = u.id
      WHERE a.id = ?
    `;
    const [rows] = await db.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  // Get applications for a job seeker (GET /api/applications/mine)
  async findByApplicantId(applicant_id) {
    const query = `
      SELECT 
        a.id,
        a.job_id,
        a.applicant_id,
        a.cover_letter,
        a.status,
        a.applied_at,
        j.title AS job_title,
        j.company AS job_company,
        j.location AS job_location,
        j.type AS job_type,
        j.salary_min AS job_salary_min,
        j.salary_max AS job_salary_max,
        j.is_active AS job_is_active,
        r.name AS recruiter_name,
        r.email AS recruiter_email
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      LEFT JOIN users r ON j.recruiter_id = r.id
      WHERE a.applicant_id = ?
      ORDER BY a.applied_at DESC
    `;
    const [rows] = await db.query(query, [applicant_id]);
    return rows;
  },

  // Get applicants for a specific job (GET /api/jobs/:id/applicants)
  async findByJobId(job_id) {
    const query = `
      SELECT 
        a.id,
        a.job_id,
        a.applicant_id,
        a.cover_letter,
        a.status,
        a.applied_at,
        u.name AS applicant_name,
        u.email AS applicant_email,
        u.created_at AS applicant_created_at
      FROM applications a
      JOIN users u ON a.applicant_id = u.id
      WHERE a.job_id = ?
      ORDER BY a.applied_at DESC
    `;
    const [rows] = await db.query(query, [job_id]);
    return rows;
  },

  // Update application status (PUT /api/applications/:id)
  async updateStatus(id, status) {
    const query = `
      UPDATE applications
      SET status = ?
      WHERE id = ?
    `;
    const [result] = await db.query(query, [status, id]);
    return result.affectedRows > 0;
  },

  // Recruiter Dashboard statistics (GET /api/applications/dashboard)
  async getRecruiterSummary(recruiter_id) {
    const jobsCountQuery = `
      SELECT COUNT(*) as total_jobs
      FROM jobs
      WHERE recruiter_id = ?
    `;
    const [jobsCount] = await db.query(jobsCountQuery, [recruiter_id]);

    const appsQuery = `
      SELECT 
        COUNT(a.id) as total_applicants,
        SUM(CASE WHEN a.status = 'pending' THEN 1 ELSE 0 END) as pending_applicants,
        SUM(CASE WHEN a.status = 'reviewed' THEN 1 ELSE 0 END) as reviewed_applicants,
        SUM(CASE WHEN a.status = 'rejected' THEN 1 ELSE 0 END) as rejected_applicants
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE j.recruiter_id = ?
    `;
    const [appsStats] = await db.query(appsQuery, [recruiter_id]);

    return {
      total_jobs_posted: jobsCount[0].total_jobs || 0,
      total_applicants: Number(appsStats[0].total_applicants || 0),
      pending_count: Number(appsStats[0].pending_applicants || 0),
      reviewed_count: Number(appsStats[0].reviewed_applicants || 0),
      rejected_count: Number(appsStats[0].rejected_applicants || 0)
    };
  }
};

module.exports = ApplicationModel;
