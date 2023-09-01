const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

//load env var
dotenv.config({path: './config/config.env'})

//load models
const Bootcamp = require('./Models/Bootcamp')
const Course = require('./Models/Course')
const User = require('./Models/User')
const Review = require('./Models/Review')

//connect to db
mongoose.connect(process.env.MONGO_URI,{
useNewUrlParser: true,
useUnifiedTopology: true
});

//read json files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/data/bootcamps.json`,'utf-8'))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/data/courses.json`,'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`,'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/data/reviews.json`,'utf-8'))

const importData = async ()=>{
    try {
        await Bootcamp.create(bootcamps)
       await Course.create(courses)
       await User.create(users)
       await Review.create(reviews)

        console.log('Data imported...'.green.inverse)
        process.exit
    } catch (error) {
        console.log(error)
    }
}

//delete data
const deleteData = async ()=>{
    try {
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
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
