const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const blacklistTokenModel = require('../models/blacklistToken.model');
const { validationResult } = require('express-validator');


module.exports.registerCaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: errors.array()[0]?.msg || 'Invalid input data',
                errors: errors.array() 
            });
        }

        const { fullname, email, password, vehicle } = req.body;

        const isCaptainAlreadyExist = await captainModel.findOne({ email });

        if (isCaptainAlreadyExist) {
            return res.status(400).json({ message: 'Captain already exists with this email' });
        }

        const hashedPassword = await captainModel.hashPassword(password);

        const captain = await captainService.createCaptain({
            firstname: fullname.firstname,
            lastname: fullname.lastname || '',
            email,
            password: hashedPassword,
            color: vehicle.color,
            plate: vehicle.plate,
            capacity: vehicle.capacity,
            vehicleType: vehicle.vehicleType
        });

        const token = captain.generateAuthToken();

        res.cookie('token', token);
        return res.status(201).json({ token, captain });
    } catch (err) {
        console.error('Error registering captain:', err);
        return res.status(500).json({ message: err.message || 'Error registering captain' });
    }
}

module.exports.loginCaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: errors.array()[0]?.msg || 'Invalid input data',
                errors: errors.array() 
            });
        }

        const { email, password } = req.body;

        const captain = await captainModel.findOne({ email }).select('+password');

        if (!captain) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await captain.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = captain.generateAuthToken();

        res.cookie('token', token);

        return res.status(200).json({ token, captain });
    } catch (err) {
        console.error('Error logging in captain:', err);
        return res.status(500).json({ message: err.message || 'Error logging in captain' });
    }
}

module.exports.getCaptainProfile = async (req, res, next) => {
    return res.status(200).json({ captain: req.captain });
}

module.exports.logoutCaptain = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

        if (token) {
            await blacklistTokenModel.create({ token });
        }

        res.clearCookie('token');

        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        return res.status(200).json({ message: 'Logged out' });
    }
}