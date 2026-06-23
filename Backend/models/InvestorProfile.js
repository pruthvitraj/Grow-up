const mongoose = require("mongoose");

const investorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },

    // ----------- Professional Details -----------
    investorprofilePhoto: { type: String, default: "" },
    jobStatus: { type: String, default: "" },
    investmentRange: { type: String, default: "" },
    investmentActiveness: { type: String, default: "" },
    investmentInterest: { type: String, default: "" },
    investorLocation: { type: String, default: "" },
    investmentType: { type: [String], default: [] },


    // ----------- Financial Verification ---------
    pan: { type: String, default: "" },
    investorLinkedin: { type: String, default: "" },
    proofOfFunds: { type: String, default: "" },
    kycId: { type: String, default: "" },

    // ----------- Preferences (UPDATED) ----------
    notificationPreference: {
        type: String,
        enum: ["sms", "email"],
        required: true,
    },

    communicationPreference: {
        type: String,
        enum: ["webMeeting", "chatbox"],
        required: true,
    },

    acceptTerms: {
        type: Boolean,
        required: true,
    },

}, { timestamps: true });

module.exports = mongoose.model("InvestorProfile", investorSchema);
