import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },
   
    avatar: {
        type: String,
        default: ''
    },

    bio: {
        type: String,
        default: ''
    },

    userProfile: {
        isSetUp: Boolean,
        default: false
    }
    
});

const Profile = mongoose.model('Profile', profileSchema);
export default Profile
