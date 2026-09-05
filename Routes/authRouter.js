const { isAuthenticated, allowRoles }=require('../middlewares/auth.js');
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
authRouter.get('/me',isAuthenticated,me);
authRouter.post('/logout',isAuthenticated,logout);


//export router
module.exports=authRouter;