
import mongoose from "mongoose";

const doubtMessageSchema = new mongoose.Schema({
    doubt: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("DoubtMessage", doubtMessageSchema);
