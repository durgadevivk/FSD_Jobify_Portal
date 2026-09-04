//import mongoose
const mongoose = require('mongoose');
//setup schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['user','recruiter','admin'],
        default: 'user'
    },
    profilePicture:{
        type: String,
        default: ''
    },
    phone:{
        type: String,
        default: ''
    },
    resume:{
        type: String,
        default: ''
    },
    bio:{
        type: String,

    },
    skills:[{
        type: String
    }],
    experience:{
        type:Number,
        default:0
    
    },location:{
        type: String,
    },
    isVerified:{
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});
//create and export the model
module.exports=mongoose.model('User',userSchema,'users');