const mongoose = require("mongoose");

const RegisterSchema = new mongoose.Schema(
    {
        role: String,
        fullName: String,
        email: String,
        phone: String,
        password: String,
        username: String,
        profilePicture: String,

        // Investor fields
        jobStatus: String,
        investmentRange: String,
        investmentActiveness: String,
        investmentInterest: String,
        investorLocation: String,
        investmentType: String,
        pan: String,
        investorLinkedin: String,
        proofOfFunds: String,
        kycId: String,
        notificationPreference: String,
        communicationPreference: String,
        investmentGoal: String,
        investorBio: String,
        acceptTerms: Boolean,

        // Founder fields
        startupName: String,
        startupImage: String,
        tagline: String,
        industry: String,
        businessStage: String,
        startupDescription: String,
        problemStatement: String,
        solutionOverview: String,
        usp: String,
        targetMarket: String,
        foundedYear: String,
        startupLocation: String,
        valuation: String,
        fundingRequirement: String,
        equityOffer: String,
        fundingType: String,
        existingInvestors: String,
        businessModel: String,
        useOfFunds: String,
        pitchDeckUrl: String,
        pitchVideoUrl: String,
        productImageUrl: String,
        coFounders: String,
        teamSize: String,
        experienceBackground: String,
        founderLinkedin: String,
        advisors: String,
        businessRegType: String,
        gstNumber: String,
        firmRegistration: String,
        patentDetails: String,

        // Under review status
        status: {
            type: String,
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Register", RegisterSchema);
