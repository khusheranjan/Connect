import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
//import cookieParser from 'cookie-parser';
import routes from './src/routes/routes.js'
import User from './src/models/User.js';

dotenv.config();

const port= process.env.PORT
const database_url= process.env.DATABASE_URL 

mongoose.connect(database_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(()=> console.log("Datable connection setup"))
    .catch(err => console.error(err));

const server= express();

server.use(cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}));
server.use(express.json());



server.post('/register', async (req, res)=>{
    const { email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
        return res.status(400).json({ message: "User already exists!" });
        }

        const newUser = await User.create({
        email,
        password,
        });

        res.status(201).json({ message: "User successfully registered!" });
    } catch (error) {
        res.status(500).json({ message: "Server error. Please try again later." });
    }
})


server.listen(port, ()=>{
    console.log(`Server listening on ${port}`)
})
