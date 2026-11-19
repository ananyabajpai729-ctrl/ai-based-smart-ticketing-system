
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin', 'moderator']
    },

    // Profile information
    name: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    skills: [String],
    interests: [String],

    // Participation preferences
    canMentor: {
        type: Boolean,
        default: false
    },
    lookingForTeam: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('User', userSchema);
