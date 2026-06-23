const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema({
  investorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  founderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  startupName: {
    type: String,
    required: true
  },
  investmentAmount: {
    type: Number,
    required: true
  },
  equityPercentage: {
    type: Number,
    required: true
  },
  message: {
    type: String
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "countered", "funding_in_progress", "funding_completed"],
    default: "pending"
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment"
  },
  counterOffer: {
    amount: Number,
    equity: Number,
    message: String,
    by: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model("Deal", dealSchema);
