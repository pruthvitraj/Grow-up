const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    participant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    duration: { type: Number, default: 30 }, // Duration in minutes
    type: {
        type: String,
        enum: ['Video Call', 'Phone Call', 'In Person'],
        default: 'Video Call'
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    },
    agenda: { type: String },
    location: { type: String }, // For physical address
    meetingLink: { type: String }, // For Google Meet, Zoom, etc.
    linkSetAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
