//import the company model
const Company=require('../models/company');

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
        return res.status(200).json({message:"get all companies endpoint"})
    }catch(e){
        return res.status(500).json({message:e.message})
    }
},
//to get single company
getCompanyById:async (req,res)=>{
    try{
        return res.status(200).json({message:"get single company by Id endpoint"})
    }catch(e){
        return res.status(500).json({message:e.message})
    }
},
//to update a company
updateCompany:async (req,res)=>{
    try{
        return res.status(200).json({message:"update company endpoint"})
    }catch(e){
        return res.status(500).json({message:e.message})
    }
},
//to delete a company
deleteCompany:async (req,res)=>{
    try{
        return res.status(200).json({message:"delete company endpoint"})
    }catch(e){
        return res.status(500).json({message:e.message})
    }
},
//to create a recruiter
createRecruiter:async (req,res)=>{
    try{
        return res.status(200).json({message:"create recruiter endpoint"})
    }catch(e){
        return res.status(500).json({message:e.message})
    }   
},
//to get all recruiters
getAllRecruiters:async (req,res)=>{
    try{
        return res.status(200).json({message:"get all recruiters endpoint"})
    }catch(e){
        return res.status(500).json({message:e.message})
    }   
}
}
module.exports = adminController;