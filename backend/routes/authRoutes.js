const express = require('express');
const { register, login, getMe, verifyAccount } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/verify', protect, verifyAccount);

module.exports = router;