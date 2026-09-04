//import express
const express=require('express');
const {register,login,me,logout}=require('../Controllers/authController.js');
//setup router
const authRouter=express.Router();
//configure routes
//public routes
authRouter.post('/register',register);
authRouter.post('/login',login);
//protected routes
authRouter.get('/me',me);
authRouter.post('/logout',logout);


//export router
module.exports=authRouter;