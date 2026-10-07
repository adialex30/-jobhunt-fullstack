const db = require('../config/db');
const JobModel = {
  async create({
    recruiter_id,
    title,
    company,
    location = null,
    type,
    description,
    requirements = null,
    salary_min = null,
    salary_max = null,
    is_active = true
  }) {
    const insertQuery = `
      INSERT INTO jobs (
        recruiter_id, title, company, location, type,
        description, requirements, salary_min, salary_max, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      recruiter_id,
      title,
      company,
      location,
      type,
      description,
      requirements,
      salary_min || null,
      salary_max || null,
      is_active
    ];
    const [result] = await db.query(insertQuery, params);
    return result.insertId;
  },
  async findAll({ page = 1, limit = 10, keyword = '', type = '', location = '' }) {
    const offset = (Number(page) - 1) * Number(limit);
    const parsedLimit = Number(limit);
    let whereConditions = ['jobs.is_active = TRUE'];
    let queryParams = [];
    if (keyword && keyword.trim() !== '') {
      const searchTerm = `%${keyword.trim()}%`;
      whereConditions.push('(jobs.title LIKE ? OR jobs.company LIKE ? OR jobs.description LIKE ? OR jobs.requirements LIKE ?)');
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    if (type && type.trim() !== '' && type !== 'all') {
      const validJobTypes = ['full-time', 'part-time', 'contract', 'internship'];
      const normalizedType = type.trim().toLowerCase();
      if (validJobTypes.includes(normalizedType)) {
        whereConditions.push('jobs.type = ?');
        queryParams.push(normalizedType);
      }
    }
    if (location && location.trim() !== '' && location !== 'all') {
      whereConditions.push('jobs.location LIKE ?');
      queryParams.push(`%${location.trim()}%`);
    }
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    const countQuery = `
      SELECT COUNT(*) as total
      FROM jobs
      ${whereClause}
    `;
    const [countResult] = await db.query(countQuery, queryParams);
    const totalJobs = countResult[0].total;
    const selectQuery = `
      SELECT 
        jobs.id,
        jobs.recruiter_id,
        jobs.title,
        jobs.company,
        jobs.location,
        jobs.type,
        jobs.description,
        jobs.requirements,
        jobs.salary_min,
        jobs.salary_max,
        jobs.is_active,
        jobs.created_at,
        users.name as recruiter_name,
        users.email as recruiter_email,
        (SELECT COUNT(*) FROM applications WHERE applications.job_id = jobs.id) as applicants_count
      FROM jobs
      LEFT JOIN users ON jobs.recruiter_id = users.id
      ${whereClause}
      ORDER BY jobs.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const fetchParams = [...queryParams, parsedLimit, offset];
    const [jobRows] = await db.query(selectQuery, fetchParams);
    const totalPages = Math.ceil(totalJobs / parsedLimit) || 1;
    return {
      totalJobs,
      totalPages,
      currentPage: Number(page),
      limit: parsedLimit,
      jobs: jobRows
    };
  },
  async findById(id) {
    const selectQuery = `
      SELECT 
        jobs.id,
        jobs.recruiter_id,
        jobs.title,
        jobs.company,
        jobs.location,
        jobs.type,
        jobs.description,
        jobs.requirements,
        jobs.salary_min,
        jobs.salary_max,
        jobs.is_active,
        jobs.created_at,
        users.name as recruiter_name,
        users.email as recruiter_email,
        (SELECT COUNT(*) FROM applications WHERE applications.job_id = jobs.id) as applicants_count
      FROM jobs
      LEFT JOIN users ON jobs.recruiter_id = users.id
      WHERE jobs.id = ?
    `;
    const [rows] = await db.query(selectQuery, [id]);
    return rows.length > 0 ? rows[0] : null;
  },
  async findByRecruiter(recruiter_id) {
    const selectQuery = `
      SELECT 
        jobs.id,
        jobs.recruiter_id,
        jobs.title,
        jobs.company,
        jobs.location,
        jobs.type,
        jobs.description,
        jobs.requirements,
        jobs.salary_min,
        jobs.salary_max,
        jobs.is_active,
        jobs.created_at,
        users.name as recruiter_name,
        users.email as recruiter_email,
        (SELECT COUNT(*) FROM applications WHERE applications.job_id = jobs.id) as applicants_count
      FROM jobs
      LEFT JOIN users ON jobs.recruiter_id = users.id
      WHERE jobs.recruiter_id = ?
      ORDER BY jobs.created_at DESC
    `;
    const [rows] = await db.query(selectQuery, [recruiter_id]);
    return rows;
  },
  async getStats() {
    const [totalRows] = await db.query('SELECT COUNT(*) as total_jobs FROM jobs WHERE is_active = TRUE');
    const [companyRows] = await db.query('SELECT COUNT(DISTINCT company) as total_companies FROM jobs WHERE is_active = TRUE');
    const [typesRows] = await db.query(`
      SELECT type, COUNT(*) as count 
      FROM jobs 
      WHERE is_active = TRUE 
      GROUP BY type
    `);
    return {
      totalJobs: totalRows[0].total_jobs,
      totalCompanies: companyRows[0].total_companies,
      typesBreakdown: typesRows
    };
  },
  async update(id, recruiter_id, updateData) {
    const allowedFields = [
      'title', 'company', 'location', 'type', 'description',
      'requirements', 'salary_min', 'salary_max', 'is_active'
    ];
    const fieldsToUpdate = [];
    const values = [];
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        fieldsToUpdate.push(`${field} = ?`);
        values.push(updateData[field]);
      }
    }
    if (fieldsToUpdate.length === 0) return false;
    const updateQuery = `
      UPDATE jobs 
      SET ${fieldsToUpdate.join(', ')} 
      WHERE id = ? AND recruiter_id = ?
    `;
    values.push(id, recruiter_id);
    const [result] = await db.query(updateQuery, values);
    return result.affectedRows > 0;
  },
  async delete(id, recruiter_id) {
    const deleteQuery = 'DELETE FROM jobs WHERE id = ? AND recruiter_id = ?';
    const [result] = await db.query(deleteQuery, [id, recruiter_id]);
    return result.affectedRows > 0;
  }
};
module.exports = JobModel;
