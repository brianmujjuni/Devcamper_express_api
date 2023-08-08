const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

//load env var
dotenv.config({path: './config/config.env'})

//load models
const Bootcamp = require('./Models/Bootcamp')

//connect to db
mongoose.connect(process.env.MONGO_URI,{
useNewUrlParser: true,
useCreateIndex: true,
useFindAndModify: false,
useUnifiedTopology: true
});

//read json files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/data/bootcamps.json`,'utf-8'))