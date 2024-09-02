import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './src/routes/routes.js';
import { Server } from 'socket.io';
import Message from './src/models/Message.js';

dotenv.config();

const port = process.env.PORT;
const database_url = process.env.DATABASE_URL;
const origin = process.env.ORIGIN;
const server = express();

mongoose.connect(database_url)
    .then(() => console.log("Database connection setup"))
    .catch(err => console.error(err));

server.use(cors({
    origin: origin,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}));

server.use(express.json());
server.use(cookieParser());
server.use('/', routes);

const httpServer = server.listen(port, () => {
    console.log(`Server listening on ${port}`);
});

const io = new Server(httpServer, {
    cors: {
        origin: origin,
        methods: ["GET", "POST", "DELETE", "PUT"],
        credentials: true
    }
});

const userSocketMap = new Map();

const disconnectSocket = (socket) => {
    console.log("User disconnected");
    for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
            userSocketMap.delete(userId);
            break;
        }
    }
};

const sendMessage= async (message)=>{
    const senderSockectId= userSocketMap.get(message.sender);
    const recieverSockectId= userSocketMap.get(message.reciever);

    const newMessage= await Message.create(message);

    const messageData= await Message.findById(newMessage._id)
        .populate("sender", "id email username name")
        .populate("reciever", "id email username name")

    if(recieverSockectId){
        io.to(recieverSockectId).emit("recievedMessage", messageData);
    }
    if(senderSockectId){
        io.to(senderSockectId).emit("recievedMessage", messageData);
    }
}

io.on("connection", (socket) => {
    console.log("Socket connection set up on server side");

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap.set(userId, socket.id);
        console.log('User connected with socket ID:', socket.id);
    } else {
        console.log("User not connected");
    }
    socket.on("sendMessage", sendMessage)
    socket.on("disconnect", () => disconnectSocket(socket));
});
