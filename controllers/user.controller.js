
const env = require('../config/validateEnv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');


// Ye user ki ID ko aik secret key ke sath mix karke token banata hai
const generateToken = (id) => {
    return jwt.sign({ id }, env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // 2. Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // 3. Create User (Password encryption Model khud karega)
    const user = await User.create({
        name,
        email,
        password
    });

    if (user) {
        const token = generateToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        })
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate a user (Login)
// @route   POST /api/users/login
// @access  Public
// ... imports ...

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // 1. User check
    if (!user) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    // 2. Lock check
    if (user.lockUntil && user.lockUntil > Date.now()) {
        res.status(403);
        throw new Error(`Account is locked. Try again later.`);
    }

    // 3. Password Check
    if (await user.matchPassword(password)) {

        await User.updateOne(
            { _id: user._id },
            {
                $set: {
                    loginAttempts: 0,
                    lockUntil: null
                }
            }
        );

        const token = generateToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });

    } else {
        // FAIL CASE:
        user.loginAttempts += 1;

        if (user.loginAttempts >= 5) {
            // Lock User (Direct Update for safety here too)
            await User.updateOne(
                { _id: user._id },
                {
                    $set: {
                        loginAttempts: user.loginAttempts,
                        lockUntil: Date.now() + 30 * 60 * 1000 // 30 mins
                    }
                }
            );

            res.status(403);
            throw new Error('Account locked due to too many failed attempts.');
        } else {
            // Sirf attempt update karo
            await User.updateOne(
                { _id: user._id },
                { $set: { loginAttempts: user.loginAttempts } }
            );

            res.status(401);
            throw new Error(`Invalid credentials. Attempts left: ${5 - user.loginAttempts}`);
        }
    }
});

// @desc    Logout user/clear cookies
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private 
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

module.exports = {
    registerUser,
    loginUser,
    getMe,
    logoutUser
};