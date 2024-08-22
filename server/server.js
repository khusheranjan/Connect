import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
//import cookieParser from 'cookie-parser';
import routes from './src/routes/routes.js'

dotenv.config();

const port= process.env.PORT
const database_url= process.env.DATABASE_URL
const origin= process.env.ORIGIN 
const server= express();

mongoose.connect(database_url)
    .then(()=> console.log("Datable connection setup"))
    .catch(err => console.error(err));


server.use(cors({
    origin: origin,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}));

server.use(express.json());

server.use('/', routes);


server.listen(port, ()=>{
    console.log(`Server listening on ${port}`)
})
