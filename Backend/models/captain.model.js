const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const captainSchema = new mongoose.Schema({
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
    },

    status:{
        type:String,
        enum:['active','inactive'],
        default:'inactive',
    },

    vehicle:{
        color:{
            type:String,
            required:true,
            minlength:[3,'minLength must be 3'],
        },

        plate:{
            type:String,
            required:true,
            minlength:[3,'minLength must be 3'],
        },
        capacity : {
            type : Number,
            required :true,
            min : [1,'min capacity must be 1'],
        },
        vehicleType:{
            type:String,
            enum : ['bike','auto','car'],
            required : true,
        },
        location:{
            lat:{
                type:Number,
            },
            lng:{
                type:Number,
            }
        }
    }
})

captainSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id } , process.env.JWT_SECRET,{expiresIn: '24h'});
}

captainSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

captainSchema.statics.hashPassword = async (password) => {
    return await bcrypt.hash(password,10);
}

const captainModel = mongoose.model('captain',captainSchema)

module.exports = captainModel