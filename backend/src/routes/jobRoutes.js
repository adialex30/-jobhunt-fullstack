const express = require('express');
const router = express.Router();
const JobController = require('../controllers/jobController');

// Bypass authentication for all job endpoints (localhost / development)
router.get('/stats', JobController.getJobStats);
router.get('/', JobController.getAllJobs);
router.get('/mine', JobController.getMyJobs);
router.get('/:id', JobController.getJobById);
router.post('/', JobController.createJob);
router.put('/:id', JobController.updateJob);
router.delete('/:id', JobController.deleteJob);

module.exports = router;
