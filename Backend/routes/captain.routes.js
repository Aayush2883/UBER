const express =  require('express');
const router = express.Router();
const {body} = require('express-validator');
const captainController = require('../controllers/captain.controller');
const captainService = require('../services/captain.service');
const captainModel = require('../models/captain.model');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage('Firstname must be at least 3 letters'),
    body('password').isLength({min:3}).withMessage('Password must be at least 3 characters'),
    body('vehicle.color').isLength({min:3}).withMessage('Vehicle color must be at least 3 characters'),
    body('vehicle.plate').isLength({min:3}).withMessage('Vehicle plate must be at least 3 characters'),
    body('vehicle.capacity').isInt({min:1}).withMessage('Vehicle capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['bike', 'auto', 'car']).withMessage('Vehicle type must be one of bike, auto, or car')
], captainController.registerCaptain);

router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:3}).withMessage('Password must be at least 3 characters')
],captainController.loginCaptain)

router.get('/profile',authMiddleware.authCaptain,captainController.getCaptainProfile);

router.get('/logout', authMiddleware.authCaptain, captainController.logoutCaptain);



module.exports = router;