const {res}=require('express')
const User=require('../models/user.js');
const bcrypt=require('bcrypt');
const {SALT_ROUNDS,JWT_SECRET,ENV}=require('../utils/config.js');
const jwt=require('jsonwebtoken');
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
            //get email and password from request body
            const {email,password}=req.body;
            //check if user with the same email exists in the database
            const user=await User.findOne({email});
            //if not return 400 error response with message 'invalid email or user does not exist
            if(!user){
                return res.status(400).json ({message:'invalid email or user does not exist'});
            }
            //if yes compare the password with the hashed password in the database using bcrypt
            const passwordMatch=await bcrypt.compare(password,user.password);
            //if not match return 400 error response with message 'invalid password'
            if(!passwordMatch){
                return res.status(400).json({message:'invalid password'});
            }
            //generate a JWT token for the user
            const token=await jwt.sign({userId:user._id},JWT_SECRET,{expiresIn:'1h'});
            //set the cookie with the token 
            res.cookie('token',token,{
                httpOnly:true,
                secure:ENV==='production',//set secure flag only in production
                sameSite:ENV==='production'?'none':'lax',//set sameSite flag to none in production
                maxAge:3600000//1 hour
            })
            //return a success response with the token
            
            return res.status(200).json({message:'user logged in successfully'});
        } catch(e) {
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