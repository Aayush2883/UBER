const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklistModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model');

module.exports.authUser = async (req,res,next)=>{
    // Use req.cookies instead of req.cookie and safely extract token
    const token = (req.cookies && req.cookies.token) || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if(!token){
        return res.status(401).json({message : "Unauthorized"})
    }

    const isBlacklisted = await blacklistModel.findOne({token : token});

    if(isBlacklisted){
        return res.status(401).json({message:"Unauthorized "})
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        console.log(decoded);
        const user = await userModel.findById(decoded._id)
        req.user = user;
        next();
    }catch(err){
        return res.status(401).json({message:"Unauthorized"});
    }
}

module.exports.authCaptain = async (req,res,next) => {
    // Use req.cookies instead of req.cookie and safely extract token
    const token = (req.cookies && req.cookies.token) || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if(!token){
        return res.status(401).json({message : "Unauthorized"})
    }

    const isBlacklisted = await blacklistModel.findOne({token : token});

    if(isBlacklisted){
        return res.status(401).json({message:"Unauthorized "})
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        console.log(decoded);
        const captain = await captainModel.findById(decoded._id).select('+password');
        req.captain = captain;
        next();}
    catch(err){
        return res.status(401).json({message:"Unauthorized"});
    }   
}