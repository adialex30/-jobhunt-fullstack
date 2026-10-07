const express = require('express');
const router = express.Router();
const ApplicationController = require('../controllers/applicationController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
router.get('/mine', verifyToken, authorizeRoles('job_seeker'), ApplicationController.getMyApplications);
router.get('/dashboard', verifyToken, authorizeRoles('recruiter'), ApplicationController.getRecruiterDashboard);
router.put('/:id', verifyToken, authorizeRoles('recruiter'), ApplicationController.updateApplicationStatus);
router.get('/:id', verifyToken, ApplicationController.getApplicationById);
module.exports = router;
