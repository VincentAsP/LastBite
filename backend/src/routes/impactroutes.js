const express = require('express');
const router = express.Router();
const { getUserEcoImpact } = require('../controllers/impactController');

router.get('/impact/:userID', getUserEcoImpact);

module.exports = router;