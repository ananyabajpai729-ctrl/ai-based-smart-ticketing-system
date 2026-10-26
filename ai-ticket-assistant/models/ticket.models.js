import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'TODO',
        enum: ['TODO', 'in-progress', 'closed']
    },
    createdBy:{
        type: mongoose.Schema.types.ObjectId,
        ref: "User"
    },
    priority: {
        type: String,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    deadline:{
        type: Date,
    },
    helpfulNotes:{
        type: String
    },
    relatedSkills: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('Ticket', ticketSchema);