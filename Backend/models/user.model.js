const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[3,'First name must have 3 letters']
        },
        lastname:{
            type:String,
        }
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },

    socketId:{
        type:String,
    }
})

userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET,{expiresIn: '24h'});
}

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async (password) => {
    return await bcrypt.hash(password,10);
}

const userModel = mongoose.model('user',userSchema);

module.exports = userModel;

