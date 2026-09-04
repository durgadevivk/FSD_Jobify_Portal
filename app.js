//import express
const express = require('express');
const authRouter = require('./Routes/authRouter');
//create express app
const app=express();
//parse the request body as json
app.use(express.json());
//configure routes
app.use('/api/v1/auth', authRouter);
//export the app
module.exports=app;