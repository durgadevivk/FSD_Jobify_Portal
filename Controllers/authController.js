const {res}=require('express')
const User=require('../models/user.js');
const bcrypt=require('bcrypt');
const {SALT_ROUNDS}=require('../utils/config.js');
//setup controller
const authController={
    //register user
    register:async (req,res)=>{
        try{
            //get name,email,password from request body
            const {name,email,password}=req.body;
            //check if user with the same email already exists in the database
            const existingUser=await User.findOne({email});
            //if yes return 400 error response with message 'user already exists'
            if(existingUser){
                return res.status(400).json({message:'user already exists'});
            }
            //hash the password using bcrypt
            const hashedPassword=await bcrypt.hash(password, parseInt(SALT_ROUNDS));
            //create new user object using user model
            const newUser=new User({
                name,
                email,
                password:hashedPassword
            })
            //save the user object to the database
            await newUser.save();
            //return the success  response
            return res.status(201).json({message:'user registered successfully'});
            
        }catch(e) {
            return res.status(500).json({error:e.message});
        }  
    },

    //login
    login:async (req,res)=>{
        try{
            return res.status(200).json({message:'login user'});
        }catch(e) {
            return res.status(500).json({error:e.message});
        }
    },
    //get the profile of
    me:async (req,res)=>{
        try{
            return res.status(200).json({message:'get profile'});
        }catch(e) {
            return res.status(500).json({error:e.message});
        }  
    },
    //logout
    logout:async (req,res)=>{
        try{
            return res.status(200).json({message:'logout user'});
        }catch(e) {
            return res.status(500).json({error:e.message});
        }  
    }

}


//export the controller
module.exports=authController;