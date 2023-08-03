const express = require('express')
const dotenv = require('dotenv')
//const logger = require('./middleware/logger')
const morgan = require('morgan')
const connectDb = require('./config/db')


//load env vars
dotenv.config({path: './config/config.env'})

//connect to database 
connectDb()
//Route files
const bootcamps = require('./routes/bootcamps')

const app = express()

//app.use(logger)
//Dev logging middleware
if(process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'))
}

//Mount routers
app.use('/api/v1/bootcamps',bootcamps)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}` ))

//handle unhandled promise rejection 
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`)
    //close server and exist process
    server.close(()=>promise.exit(1))
})