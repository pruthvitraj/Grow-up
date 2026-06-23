const mongoose = require('mongoose');

const founderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // STEP 1 — Startup Info
    startupName: { type: String },
    startupImage: { type: String },     // path stored from Supabase
    tagline: { type: String },
    industry: { type: String },
    startupDescription: { type: String },
    problemStatement: { type: String },
    solutionOverview: { type: String },
    targetMarket: { type: String },
    founderLinkedin: { type: String },
    foundedYear: { type: String },      // date string
    startupLocation: { type: String },

    // STEP 2 — Financial Info
    valuation: { type: Number },
    fundingRequirement: { type: Number },
    equityOffer: { type: Number },

    fundingType: { type: [String] },     // array ["Equity", "Debt"]

    existingInvestors: { type: String }, // “Yes” / “No”

    businessModel: { type: String },
    useOfFunds: { type: String },

    // STEP 3 — Legal & Pitch
    pitchDeckUrl: { type: String },       // only file path
    pitchVideoUrl: { type: String },

    productImageUrl: { type: String },    // only file path

    teamSize: { type: Number },
    coFounders: { type: String },
    experienceBackground: { type: String },

    gstNumber: { type: String },

    firmRegistration: { type: String },   // only file path
    patentDetails: { type: String },      // only file path (optional)

}, { timestamps: true });

module.exports = mongoose.model('FounderProfile', founderSchema);
