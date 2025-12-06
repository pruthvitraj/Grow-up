// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    phone: {
        type: String,
        required: true,
        match: [/^[0-9]{10}$/, "Phone number must be 10 digits"] // ✔ simple validation
    },

    password: { type: String, required: true },

    role: {
        type: String,
        enum: ['investor', 'founder', null],
        default: null
    },

    isProfileComplete: {
        type: Boolean,
        default: false
    },

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
