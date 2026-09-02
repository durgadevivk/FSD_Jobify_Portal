//setup mongodb cnx
//import mongoose
const mongoose = require('mongoose');
const {MONGODB_URI} = require('./utils/config.js');
//connect to mongodbb url
const dns=require('dns')
dns.setServers(['8.8.8.8','8.8.4.4'])
mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('connected to MongoDB');
})
.catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
})