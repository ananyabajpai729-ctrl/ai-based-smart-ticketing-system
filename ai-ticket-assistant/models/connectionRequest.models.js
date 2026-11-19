
import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: true
    },

    message: {
        type: String,
        trim: true,
        maxlength: 500,
        default: ""
    },

    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "cancelled"],
        default: "pending"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("ConnectionRequest", connectionRequestSchema);
