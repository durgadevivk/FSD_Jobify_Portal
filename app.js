//import express
const express = require('express');
const authRouter = require('./Routes/authRouter');
const companyRouter = require('./Routes/companyRouter');
const cookieParser = require('cookie-parser');
//create express app
const app=express();
//parse cookies
app.use(cookieParser());

//parse the request body as json
app.use(express.json());
//configure routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/companies',companyRouter);
//export the app
module.exports=app;