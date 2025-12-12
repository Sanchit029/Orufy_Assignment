const express = require('express');
const router = express.Router();
const { login, verifyOTP, getMe, resendOTP } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.get('/me', protect, getMe);

module.exports = router;
