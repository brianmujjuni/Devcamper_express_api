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
useUnifiedTopology: true
});

//read json files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/data/bootcamps.json`,'utf-8'))

const importData = async ()=>{
    try {
        await Bootcamp.create(bootcamps)
        console.log('Data imported'.green.inverse)
        process.exit
    } catch (error) {
        console.log(error)
    }
}

//delete data
const deleteData = async ()=>{
    try {
        await Bootcamp.deleteMany(bootcamps)
        console.log('Data Destroyed'.red.inverse)
        process.exit
    } catch (error) {
        console.log(error)
    }
}

if(process.argv[2] === '-i'){
    importData()
}else if(process.argv[2] === '-d'){
    deleteData()
}