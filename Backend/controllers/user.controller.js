const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.registerUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: errors.array()[0]?.msg || 'Invalid input data',
                errors: errors.array() 
            });
        }

        const { fullname, email, password } = req.body;

        const isUserAlready = await userModel.findOne({ email });

        if (isUserAlready) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const hashedPassword = await userModel.hashPassword(password);

        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname || '',
            email,
            password: hashedPassword
        });

        const token = user.generateAuthToken();

        res.cookie('token', token);
        return res.status(201).json({ token, user });
    } catch (err) {
        console.error('Error registering user:', err);
        return res.status(500).json({ message: err.message || 'Error registering user' });
    }
}

module.exports.loginUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: errors.array()[0]?.msg || 'Invalid input data',
                errors: errors.array() 
            });
        }

        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = user.generateAuthToken();

        res.cookie('token', token);

        return res.status(200).json({ token, user });
    } catch (err) {
        console.error('Error logging in user:', err);
        return res.status(500).json({ message: err.message || 'Error logging in' });
    }
}

module.exports.getUserProfile = async (req, res, next) => {
    return res.status(200).json(req.user);
}

module.exports.logoutUser = async (req, res, next) => {
    try {
        res.clearCookie('token');
        const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

        if (token) {
            await blacklistTokenModel.create({ token });
        }

        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        return res.status(200).json({ message: 'Logged out' });
    }
}