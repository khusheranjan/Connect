import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
   
    avatar: {
        type: String,
        default: ''
    },

    bio: {
        type: String,
        default: ''
    },

    
});

const Profile = mongoose.model('Profile', profileSchema);
export default Profile
