import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './src/routes/routes.js';
import { Server } from 'socket.io';
import Message from './src/models/Message.js';
import Room from './src/models/Room.js';

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
    const senderSocketId= userSocketMap.get(message.sender);
    const receiverSocketId= userSocketMap.get(message.receiver);

    const newMessage= await Message.create(message);

    const messageData= await Message.findById(newMessage._id)
        .populate("sender", "id email username name avatar")
        .populate("receiver", "id email username name avatar")

    if(receiverSocketId){
        io.to(receiverSocketId).emit("receiveMessage", messageData);
    }
    if(senderSocketId){
        io.to(senderSocketId).emit("receiveMessage", messageData);
    }
}

const sendChannelMessage = async (data) => {
    try {
        const { channelId, senderId, content } = data;

        const channel = await Room.findById(channelId);
        if (!channel) {
            console.error('Channel not found');
            return;
        }

        // Check if sender is a member
        if (!channel.members.includes(senderId)) {
            console.error('Sender is not a member of this channel');
            return;
        }

        const newMessage = await Message.create({
            sender: senderId,
            content: content,
            timestamp: new Date()
        });

        channel.messages.push(newMessage._id);
        await channel.save();

        const messageData = await Message.findById(newMessage._id)
            .populate("sender", "id email username name avatar");

        // Broadcast to all members in the channel
        channel.members.forEach(memberId => {
            const memberSocketId = userSocketMap.get(memberId.toString());
            if (memberSocketId) {
                io.to(memberSocketId).emit("receiveChannelMessage", {
                    channelId: channelId,
                    message: messageData
                });
            }
        });
    } catch (error) {
        console.error('Error sending channel message:', error);
    }
}

const joinChannelRoom = async (data) => {
    const { channelId, userId } = data;
    console.log(`User ${userId} joining channel ${channelId}`);
}

io.on("connection", (socket) => {
    console.log("Socket connection set up on server side");

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap.set(userId, socket.id);
        console.log('User connected with socket ID:', socket.id);

        // Broadcast to all clients that this user is online
        io.emit("userOnline", userId);
    } else {
        console.log("User not connected");
    }

    socket.on("sendMessage", sendMessage);
    socket.on("sendChannelMessage", sendChannelMessage);
    socket.on("joinChannel", joinChannelRoom);
    socket.on("disconnect", () => {
        disconnectSocket(socket);
        // Broadcast to all clients that this user is offline
        if (userId) {
            io.emit("userOffline", userId);
        }
    });
});
