// routes/timer.routes.js
const express = require('express');
const router = express.Router();

// Import fungsi dari controller
const { syncTime } = require('../controllers/timer.controller');

// Definisikan endpoint GET /sync-time
router.get('/sync-time', syncTime);

module.exports = router;