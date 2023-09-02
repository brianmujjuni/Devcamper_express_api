const express = require('express')
const dotenv = require('dotenv')
const logger = require('./middleware/logger')
const morgan = require('morgan')
const colors = require('colors')
const errorHandler = require('./middleware/error')
const fileUpload = require('express-fileupload')
const connectDb = require('./config/db')
const path = require('path')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const app = express()

//load env vars
dotenv.config({path: './config/config.env'})

//connect to database 
connectDb()
//Route files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/reviews')


//file upload
app.use(fileUpload())

//Sanitize Data
app.use(mongoSanitize())
// Set Security headers
app.use(helmet())

//Prevent cross site scripting
app.use(xss())

//set static folder
app.use(express.static(path.join(__dirname, 'public')))
//Body parser
app.use(express.json())

//cookie parser
app.use(cookieParser())

//Dev logging middleware
if(process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'))
}

//Mount routers
app.use('/api/v1/bootcamps',bootcamps)
app.use('/api/v1/courses',courses)
app.use('/api/v1/users',users)
app.use('/api/v1/auth',auth)
app.use('/api/v1/reviews',reviews)

//middle ware
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold ))

//handle unhandled promise rejection 
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`.red)
    //close server and exist process
    server.close(()=>promise.exit(1))
})