import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({

    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

friendSchema.index({ user1: 1, user2: 1 }, { unique: true });

const Friend = mongoose.model('Friend', friendSchema);
export default Friend;
