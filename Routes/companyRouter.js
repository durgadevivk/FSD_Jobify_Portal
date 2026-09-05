const express=require('express');
const {createCompany,getAllCompanies,getCompanyById,updateCompany,deleteCompany,createRecruiter,getAllRecruiters}=require('../Controllers/adminController.js');
const {isAuthenticated,allowRoles}=require('../middlewares/auth.js');
const companyRouter=express.Router();


//all the following rotes are protected routes and only accessible by admin
companyRouter.use(isAuthenticated);
companyRouter.use(allowRoles(['admin']));
companyRouter.post('/',createCompany);
companyRouter.get('/',getAllCompanies);
companyRouter.get('/:id',getCompanyById);
companyRouter.put('/:id',updateCompany);
companyRouter.delete('/:id',deleteCompany);
companyRouter.post('/:id/recruiters',createRecruiter);
companyRouter.get('/:id/recruiters',getAllRecruiters);

module.exports=companyRouter;