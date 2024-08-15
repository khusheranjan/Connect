import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],

    createdAt: {
        type: Date,
        default: Date.now
    },

});

const Room = mongoose.model('ChatRoom', chatRoomSchema);
export default Room
