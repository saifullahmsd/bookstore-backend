// routes/user.routes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, logoutUser } = require('../controllers/user.controller');
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: {
        success: false,
        message: "Too many login attempts, please try again after 15 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false,
})

const { protect } = require('../middlewares/auth.middleware');

// 1. Register Route (POST /api/users)
router.post('/', loginLimiter, registerUser);

// 2. Login Route (POST /api/users/login)
router.post('/login', loginLimiter, loginUser);

// 2. Logout Route (POST /api/users/logout)
router.post('/logout', logoutUser);

// 3. User Info (GET /api/users/me) 
router.get('/me', protect, getMe);

module.exports = router;