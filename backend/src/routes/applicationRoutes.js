const express = require('express');
const router = express.Router();
const ApplicationController = require('../controllers/applicationController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// GET /api/applications/mine - Riwayat lamaran user yang login (Job Seeker)
router.get('/mine', verifyToken, authorizeRoles('job_seeker'), ApplicationController.getMyApplications);

// GET /api/applications/dashboard - Ringkasan dashboard recruiter (Recruiter)
router.get('/dashboard', verifyToken, authorizeRoles('recruiter'), ApplicationController.getRecruiterDashboard);

// PUT /api/applications/:id - Update status lamaran (Recruiter)
router.put('/:id', verifyToken, authorizeRoles('recruiter'), ApplicationController.updateApplicationStatus);

// GET /api/applications/:id - Detail lamaran (Applicant / Recruiter)
router.get('/:id', verifyToken, ApplicationController.getApplicationById);

module.exports = router;
