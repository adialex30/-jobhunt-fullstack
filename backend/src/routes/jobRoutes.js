const express = require('express');
const router = express.Router();
const JobController = require('../controllers/jobController');
const ApplicationController = require('../controllers/applicationController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// 1. Public Routes
// GET /api/jobs/stats - Ringkasan statistik jobs (Public)
router.get('/stats', JobController.getJobStats);

// GET /api/jobs/mine - Daftar job milik recruiter yang sedang login (Auth: Recruiter)
// CATATAN: Wajib didefinisikan sebelum /:id agar tidak tertimpa parameter id
router.get('/mine', verifyToken, authorizeRoles('recruiter'), JobController.getMyJobs);

// GET /api/jobs - Semua job aktif dengan filter, search, pagination (Public)
router.get('/', JobController.getAllJobs);

// GET /api/jobs/:id - Detail satu job (Public)
router.get('/:id', JobController.getJobById);

// 2. Recruiter Job Management Routes
// POST /api/jobs - Posting job baru (Auth: Recruiter)
router.post('/', verifyToken, authorizeRoles('recruiter'), JobController.createJob);

// PUT /api/jobs/:id - Update job milik sendiri (Auth: Recruiter)
router.put('/:id', verifyToken, authorizeRoles('recruiter'), JobController.updateJob);

// DELETE /api/jobs/:id - Hapus job milik sendiri (Auth: Recruiter)
router.delete('/:id', verifyToken, authorizeRoles('recruiter'), JobController.deleteJob);

// 3. Applications Routes under Jobs
// POST /api/jobs/:id/apply - Lamar pekerjaan (Auth: Job Seeker)
router.post('/:id/apply', verifyToken, authorizeRoles('job_seeker'), ApplicationController.applyJob);

// GET /api/jobs/:id/applicants - Daftar pelamar untuk job tertentu (Auth: Recruiter)
router.get('/:id/applicants', verifyToken, authorizeRoles('recruiter'), ApplicationController.getJobApplicants);

module.exports = router;
