const express = require('express');
const router = express.Router();
const { submitReport, getReports, resolveReport, suspendSeller } = require('../controllers/reportController');

router.post('/submit', submitReport);

router.get('/list', getReports);

router.put('/resolve/:reportID', resolveReport);

router.post('/suspend', suspendSeller);

module.exports = router;