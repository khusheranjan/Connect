import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({

    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

requestSchema.index({ requester: 1, recipient: 1 }, { unique: true });

const Request = mongoose.model('Request', requestSchema);
export default Request;
