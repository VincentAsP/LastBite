const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rute ini akan dipanggil sebagai /api/register dan /api/login dari index.js
router.post('/register', authController.registerUser);
router.post('/login', authController.login);

module.exports = router;