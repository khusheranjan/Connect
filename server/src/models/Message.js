import mongoose from "mongoose";

const messageSchema= new mongoose.model({

    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    reciever:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },

    content:{
        type: String,
        required: true,
    },

    timestamp:{
        type: Date,
        default: Date.now,
    }
})

const Message = mongoose.model('Message', messageSchema); 
export default Message