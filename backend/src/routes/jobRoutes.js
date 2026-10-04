const express = require('express');
const router = express.Router();
const JobController = require('../controllers/jobController');
const ApplicationController = require('../controllers/applicationController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// Public & Job Listing Routes
router.get('/stats', JobController.getJobStats);
router.get('/', JobController.getAllJobs);
router.get('/mine', JobController.getMyJobs);
router.get('/:id', JobController.getJobById);
router.post('/', JobController.createJob);
router.put('/:id', JobController.updateJob);
router.delete('/:id', JobController.deleteJob);

// Applications Integration Routes (Per Specification)
// POST /api/jobs/:id/apply - Lamar pekerjaan (Auth: Job Seeker)
router.post('/:id/apply', verifyToken, authorizeRoles('job_seeker'), ApplicationController.applyJob);

// GET /api/jobs/:id/applicants - Daftar pelamar untuk job tertentu (Auth: Recruiter)
router.get('/:id/applicants', verifyToken, authorizeRoles('recruiter'), ApplicationController.getJobApplicants);

module.exports = router;
