const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../utils/config.js');
const User=require('../models/user.js');
//middleware to check if the user is authenticated
const isAuthenticated=async(req,res,next)=>{
//get the token from the cookie
const token=req.cookies && req.cookies.token;

//if there is no token return 401 error response with message 'user is not authenticated'
if(!token){
    return res.status(401).json({message:'user is not authenticated'});
}
try{
//if there is a token verify the token using jwt.verify() method
const decoded=await jwt.verify(token,JWT_SECRET);

//if the token is valid get the user id from the token 
const userId=decoded.userId;
//add the userId to the request object for further use in the next middleware or router handler
req.userId=userId;
//call the next middleware or router handler
next();
}catch(e){
return res.status(401).json({message:'user is not authenticated'});
}
}
//middleware to chk if the user has the required role
const allowRoles=(roles)=>{
    return async(req,res,next)=>{
        //get the user id from the request object
        const userId=req.userId;

        //get the user from the database using the user id
        const user=await User.findById(userId);
        //check if the user exist
        if(!user){
            return res.status(404).json({message:'user is not found'});
        }
        //chk if the user role is included in the allowed roles
        //if not return 403 error response with message 'Forbiden:you do not have required role to access
        //  this resource
        if(!roles.includes(user.role)){
            return res.status(403).json({message:'Forbiden:you do not have required role to access this resource'});
        }
        //add the user object to the request object for further use in the next middleware or router handler
        req.user=user;
        //if yes call the next middleware or router handler
        next();
    }
}
//export the middleware function
module.exports={
    isAuthenticated,allowRoles
}