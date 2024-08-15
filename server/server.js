import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const port= process.env.PORT
const database_url= process.env.DATABASE_URL 

const server= express();

server.listen(port, ()=>{
    console.log(`Server listening on ${port}`)
})

mongoose.connect(database_url || '')
    .then(()=> console.log("Datable connection setup"))
    .catch(err => console.error(err));