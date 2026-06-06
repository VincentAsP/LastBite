const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');



router.post('/register', authController.registerUser);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password',  authController.resetPassword);

module.exports = router;