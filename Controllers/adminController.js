//import the company model
const Company=require('../models/company');
const User=require('../models/user');
const bcrypt=require('bcrypt');
const {SALT_ROUNDS}=require('../utils/config.js');

const adminController={
//to create a new company
createCompany:async (req,res)=>{
    try{
        //get name,description,website,location,size,foundedYear from the request body
        const {name,description,website,location,industry,size,foundedYear}=req.body;
        //check if the company already exists in the database using the name
        const companyExists=await Company.findOne({name:name})
        //if yes return 400 error response with message 'company already exists'
        if(companyExists){
            return res.status(400).json({message:"company already exist"})
        }
        //create new company object from company model and data from the request body
        const newCompany=new Company({
            name,
            description,
            industry,
            location,
            website,
            size,
            foundedYear,
            createdBy:req.user._id
        })
        //save the company object to the database and store it in a variable
        const savedCompany=await newCompany.save();
        //delete the __vproperty from the saved company object
        const {__v, ...result}=savedCompany.toObject();
        //return 201 response with message 'company created successfully' and the company object
        return res.status(201).json({message:"company created successfully",result})
    }catch(e){
        return res.status(500).json({message:e.message})
    }
},
//to get all companies
getAllCompanies:async (req,res)=>{
    try{
        //to get all the companies from db and store a result in a variable
        const companies=await Company.find().populate('createdBy','name email');
        //return a 200 status with mesage"companies retrived successfully"

        return res.status(200).json({message:"companies retrived successfully",result:companies});
    }catch(e){
        return res.status(500).json({message:e.message})
    }
},
//to get single company by Id
getCompanyById:async (req,res)=>{
    try{
        //get the company id from the request params
        const {id}=req.params;
        // get the company from the db and store in variable
        const company=await Company.findById(id).populate('createdBy','name email')
        //if company doesnot exist return 404 not found error
        if(!company){
            return res.status(404).json({message:"company not found"})
        }
        //return a 200 status response message " company retrieved successfully"
        return res.status(200).json({message:"company retrieved success",result:company});
    }catch(e){
        return res.status(500).json({message:e.message})
    }
},
//to update a company
updateCompany:async (req,res)=>{
    try{
        //get the company id from the request params
        const {id}=req.params;
        //get the company details from the request body
        const {name,description,website,location,industry,size,foundedYear}=req.body;
        //find the company by id and update with new details
        const updateCompany=await Company.findByIdAndUpdate(id,{
        name,
        description,
        industry,
        location,
        website,
        size,
        foundedYear
        },{new:true});
        
        //return a 200 success status
        return res.status(200).json({message:"update company successfully",result:updateCompany});
    }catch(e){
        return res.status(500).json({message:e.message})
    }
},
//to delete a company
deleteCompany:async (req,res)=>{
    try{
        //get the company id from request params
        const {id}=req.params;
        //delete the company from the db using idand store the result in a variable
        const deleteCompany=await Company.findByIdAndDelete(id);
        //if the company does not exist return 404 as company not found
        if(!deleteCompany){
            return res.status(404).json({message:"comapny not found"})
        }
        return res.status(200).json({message:"delete company done",result:deleteCompany})
    }catch(e){
        return res.status(500).json({message:e.message})
    }
},
//to create a recruiter
createRecruiter:async (req,res)=>{
    try{
        //to get the company id from request params
        const {id} =req.params;
        //create a new user ith role recruiter and assign to a company
        //get the details{name,email,password}from the requst body
        const {name,email,password}=req.body;
        //chk if the user exist with email in the body
        const user=await User.findOne({email:email});
        //if yes return 404 status
        if(user){
            return res.status(400).json({message:"user already exist",user})
        }
        //if the company exists with the company id provided in the request body
        const company=await Company.findById(id);
        //if no return 404
        if(!company){
            return res.status(404).json({message:"company not found"});
        }
        //hash the password using bcrypt
        const hashedPassword=await bcrypt.hash(password,parseInt(SALT_ROUNDS));
        //create a new user object with the user model and the data from the request body
        const newUser=new User({
            name,
            email,
            password:hashedPassword,
            role:'recruiter',
            assignedCompany:company._id
        })
        //save the new user objeect to the db and store it in variable
        const savedUser=await newUser.save();   
        //if user is not created return 500 error as recruiter creation failed
        if(!savedUser){
            return res.status(500).json({message:" recruiter creation failed"});
        }
        //delete the password and __v property from the saved user object
        const {password: _, __v, ...result}=savedUser.toObject();
        //return 201 status code with a message "recruiter created succesfully

        return res.status(201).json({message:"create recruiter done",result })
    }catch(e){
        return res.status(500).json({message:e.message})
    }   
},
//to get all recruiters
getAllRecruiters:async (req,res)=>{
    try{
        //get a company id from the req params
        const {id}=req.params;
        //chk the company exists with company id provided in the req params
        const company=await Company.findById(id);
        //if no return 404
        if(!company){
            return res.status(404).json({message:"company not found"})
        }
        //get all the company detaild from db using companyId and store result in variable
        const recruiters=await User.find({assignedCompany:id,role:'recruiter'}).select('-password -__v');
        //return 200 status code meassage  "recruiters retrieve done"
        return res.status(200).json({message:"recruiters retrieve done",result:recruiters})
    }catch(e){
        return res.status(500).json({message:e.message})
    }   
}
}
module.exports = adminController;