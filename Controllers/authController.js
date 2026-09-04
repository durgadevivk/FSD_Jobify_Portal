const {res}=require('express')
//setup controller
const authController={
    //register user
    register:async (req,res)=>{
        try{
            return res.status(200).json({message:'register user'});
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