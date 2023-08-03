const express = require('express')
const dotenv = require('dotenv')

//load env vars
dotenv.config({path: './config/config.env'})

const app = express()

app.get('/api/v1/bootcamps',(req,res)=>{
    res.status(200).json({success: true,msg: 'Show all botcamps'});
})

app.post('/api/v1/bootcamps',(req,res)=>{
    res.status(200).json({success: true,msg: 'Create new botcamps'});
})

app.put('/api/v1/bootcamps/:id',(req,res)=>{
    res.status(200).json({success: true,msg: `Update botcamp ${req.params.id}`});
})

app.get('/api/v1/bootcamps/:id',(req,res)=>{
    res.status(200).json({success: true,msg: `Show botcamp ${req.params.id}`});
})


app.delete('/api/v1/bootcamps/:id',(req,res)=>{
    res.status(200).json({success: true,msg: `Delete botcamp ${req.params.id}`});
})

const PORT = process.env.PORT || 5000

app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}` ))