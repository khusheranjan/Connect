import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    
    email: {
        type: String,
        unique: true,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
    },
   
    avatar: {
        type: String,
        default: ''
    },

    bio: {
        type: String,
        default: ''
    }
})

const User = mongoose.model('User', userSchema);
export default User