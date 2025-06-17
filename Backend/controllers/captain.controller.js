const captainModel = require('../models/captain.model');
const userModel = require('../models/user.model');
const captainService = require('../services/captain.service');
const {validationResult} = require('express-validator')
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.registerCaptain = async (req,res,next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(401).json({ errors: errors.array() });
    }

    const {fullname,email,password,vehicle} =  req.body;

    const isCaptainExist = await captainModel.findOne({email});

    if(isCaptainExist){
        return res.status(400).json({message:"Captain already exist"});
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color:vehicle.color,
        plate:vehicle.plate,
        capacity:vehicle.capacity,
        vehicleType:vehicle.vehicleType,
    })

    const token = await captain.generateAuthToken();

    res.status(201).json({token,captain}); 
}

module.exports.loginCaptain = async (req,res,next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(401).json({ errors: errors.array() });
    }

    const { email , password } =  req.body ;

    const captain = await captainModel.findOne({email}).select('+password');

    if(!captain){
        return res.status(401).json({message: "Invalid Captain or password"})
    }

    const matchPasswd = await captain.comparePassword(password);

    if(!matchPasswd){
        return res.status(401).json({message: "Invalid Captain or password"})
    }

    const token = await captain.generateAuthToken();

    res.cookie('token',token);

    res.status(201).json({token,captain});

}

module.exports.getCaptainProfile = async (req,res,next) => {
    res.status(200).json(req.captain);
}

module.exports.logoutCaptain = async (req,res,next) => {
    const token = (req.cookies && req.cookies.token) || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    
    if(!token){
        return res.status(401).json({message:"Unauthorized"}); 
    }                                                                                    
    
    await blacklistTokenModel.create({token});
    
    res.status(200).json({message:"logged out"});
    
}