const express = require('express');
const { handleRun } = require('../controllers/orchestratorController');
const router = express.Router();

router.post('/run', handleRun);

module.exports = router;