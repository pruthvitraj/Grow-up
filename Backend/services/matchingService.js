// services/matchingService.js
// ─────────────────────────────────────────────────────────────────────────────
// AI Match Scoring Engine — Grow-Up Platform
// ─────────────────────────────────────────────────────────────────────────────
const InvestorProfile = require('../models/InvestorProfile');
const FounderProfile  = require('../models/FounderProfile');
const User            = require('../models/User');

// ─────────────────────────────────────────────────
// Utility: Fuzzy keyword match (case-insensitive)
// Returns true if any word from `a` appears in `b` or vice-versa
// ─────────────────────────────────────────────────
function fuzzyMatch(a = '', b = '') {
    if (!a || !b) return false;
    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    const wordsA = normalize(String(a));
    const wordsB = normalize(String(b));
    return wordsA.some(w => w.length > 2 && wordsB.includes(w)) ||
           wordsB.some(w => w.length > 2 && wordsA.includes(w));
}

// ─────────────────────────────────────────────────
// Utility: Parse funding range strings
// Handles: ₹5L-50L, ₹10L-1Cr, ₹50L-5Cr, 10L-1Cr etc.
// Returns { min, max } in absolute rupee values
// ─────────────────────────────────────────────────
function parseFundingRange(rangeStr = '') {
    if (!rangeStr) return null;

    // Strip ₹, commas, spaces
    const clean = rangeStr.replace(/[₹,\s]/g, '').toUpperCase();

    // Parse a single value like "5L", "10L", "1Cr", "2.5Cr"
    const parseValue = (val) => {
        if (!val) return null;
        const crMatch = val.match(/^([\d.]+)CR?$/);
        if (crMatch) return parseFloat(crMatch[1]) * 1e7; // Crore → rupees

        const lMatch = val.match(/^([\d.]+)L?$/);
        if (lMatch) return parseFloat(lMatch[1]) * 1e5;  // Lakh → rupees

        return null;
    };

    // Split on hyphen
    const parts = clean.split('-');
    if (parts.length !== 2) return null;

    const min = parseValue(parts[0]);
    const max = parseValue(parts[1]);

    if (min === null || max === null) return null;
    return { min, max };
}

// ─────────────────────────────────────────────────
// Utility: Business stage inference from investor activeness
// "Very Active" / "Active" → early-stage (small amounts OK)
// "Moderate" / "Passive"   → growth stage (larger amounts)
// ─────────────────────────────────────────────────
function stageMatch(investorActiveness = '', founderFundingReq = 0) {
    if (!investorActiveness || !founderFundingReq) return false;
    const act = investorActiveness.toLowerCase();

    const earlyStageMax  = 1e7;   // ≤ ₹1Cr  → early stage
    const growthStageMax = 1e8;   // ≤ ₹10Cr → growth stage

    if ((act.includes('very active') || act.includes('active')) && founderFundingReq <= earlyStageMax)  return true;
    if ((act.includes('moderate'))                                && founderFundingReq <= growthStageMax) return true;
    if ((act.includes('passive') || act.includes('selective'))   && founderFundingReq > earlyStageMax)   return true;

    return false;
}

// ─────────────────────────────────────────────────
// Core: calculateMatchScore(founder, investor)
// Returns { score (0–100), breakdown }
// ─────────────────────────────────────────────────
function calculateMatchScore(founder, investor) {
    let score = 0;
    const breakdown = {
        industryMatch:   0,
        fundingRange:    0,
        businessStage:   0,
        locationMatch:   0,
        investmentType:  0,
    };

    // 1. Industry Match — +40 pts
    if (fuzzyMatch(founder.industry, investor.investmentInterest)) {
        breakdown.industryMatch = 40;
    }

    // 2. Funding Range — +25 pts
    const range = parseFundingRange(investor.investmentRange);
    if (range && founder.fundingRequirement) {
        const req = Number(founder.fundingRequirement);
        if (req >= range.min && req <= range.max) {
            breakdown.fundingRange = 25;
        }
    }

    // 3. Business Stage — +15 pts
    if (stageMatch(investor.investmentActiveness, founder.fundingRequirement)) {
        breakdown.businessStage = 15;
    }

    // 4. Location Match — +10 pts
    if (fuzzyMatch(founder.startupLocation, investor.investorLocation)) {
        breakdown.locationMatch = 10;
    }

    // 5. Investment Type — +10 pts (array intersection)
    const founderTypes   = Array.isArray(founder.fundingType)      ? founder.fundingType      : [];
    const investorTypes  = Array.isArray(investor.investmentType)  ? investor.investmentType  : [];

    const founderTypesLC  = founderTypes.map(t  => String(t).toLowerCase().trim());
    const investorTypesLC = investorTypes.map(t => String(t).toLowerCase().trim());

    const intersection = founderTypesLC.filter(t => investorTypesLC.includes(t));
    if (intersection.length > 0) {
        breakdown.investmentType = 10;
    }

    score = Object.values(breakdown).reduce((a, b) => a + b, 0);
    return { score, breakdown };
}

// ─────────────────────────────────────────────────
// Service: getBestInvestorsForFounder(founderId)
// Fetches all approved investors, scores them via ML API, sorts descending
// Returns array of investor objects with matchScore + scoreBreakdown
// ─────────────────────────────────────────────────
async function getBestInvestorsForFounder(founderId) {
    const axios = require('axios');
    
    // 1. Fetch the requesting founder's profile
    const founderProfile = await FounderProfile.findOne({ user: founderId });
    if (!founderProfile) throw new Error('Founder profile not found');

    // 2. Fetch all investors whose User status is 'approved'
    const approvedInvestorUsers = await User.find({ role: 'investor', status: 'approved' }).select('_id');
    const approvedIds = approvedInvestorUsers.map(u => u._id);

    const investors = await InvestorProfile.find({ user: { $in: approvedIds } })
        .populate({ path: 'user', select: 'name email phone status' });

    // 3. Score each investor using ML API
    const scoredPromises = investors.map(async (inv) => {
        const range = parseFundingRange(inv.investmentRange) || { min: 0, max: 1000000000 };
        const payload = {
            fundingRequirement: Number(founderProfile.fundingRequirement) || 0,
            fundingType: Array.isArray(founderProfile.fundingType) ? founderProfile.fundingType[0] : (founderProfile.fundingType || "Equity"),
            startupLocation: founderProfile.startupLocation || "",
            industry: founderProfile.industry || "",
            investment_min: range.min,
            investment_max: range.max,
            investmentInterest: inv.investmentInterest || "",
            investmentType: Array.isArray(inv.investmentType) ? inv.investmentType[0] : (inv.investmentType || "Equity"),
            investorLocation: inv.investorLocation || ""
        };

        let mlScore = 0;
        try {
            const response = await axios.post("http://localhost:5001/predict", payload);
            let data = response.data;
            
            let rawScore = 0;
            
            if (data.result && data.result.probability) {
                const prob = data.result.probability;
                rawScore = (prob.class_1 !== undefined) ? prob.class_1 : (typeof prob === 'number' ? prob : 0);
            } else {
                rawScore = data.match_score !== undefined ? data.match_score : (data.match_success !== undefined ? data.match_success : 0);
            }

            if (rawScore > 0 && rawScore <= 1) {
                mlScore = Math.round(rawScore * 100);
            } else if (rawScore > 1) {
                mlScore = Math.round(rawScore);
            } else if (data.match_success === 1 || data.match_success === true || (data.result && data.result.prediction === 1)) {
                mlScore = 95;
            } else {
                mlScore = 15;
            }
        } catch (error) {
            console.error("ML API Error for investor", inv._id, error.message);
            // Fallback to local heuristic
            mlScore = calculateMatchScore(founderProfile, inv).score;
        }

        const obj = inv.toObject();
        obj.matchScore = Math.min(100, Math.max(0, mlScore));
        obj.scoreBreakdown = { mlScore: obj.matchScore };
        return obj;
    });

    const scored = await Promise.all(scoredPromises);

    // 4. Sort descending by matchScore
    scored.sort((a, b) => b.matchScore - a.matchScore);

    return scored;
}

// ─────────────────────────────────────────────────
// Service: getBestFoundersForInvestor(investorId)
// Fetches all approved founders, scores them via ML API, sorts descending
// Returns array of founder objects with matchScore + scoreBreakdown
// ─────────────────────────────────────────────────
async function getBestFoundersForInvestor(investorId) {
    const axios = require('axios');

    // 1. Fetch the requesting investor's profile
    const investorProfile = await InvestorProfile.findOne({ user: investorId });
    if (!investorProfile) throw new Error('Investor profile not found');

    // 2. Fetch all founders whose User status is 'approved'
    const approvedFounderUsers = await User.find({ role: 'founder', status: 'approved' }).select('_id');
    const approvedIds = approvedFounderUsers.map(u => u._id);

    const founders = await FounderProfile.find({ user: { $in: approvedIds } })
        .populate({ path: 'user', select: 'name email phone status' });

    // 3. Score each founder using ML API
    const range = parseFundingRange(investorProfile.investmentRange) || { min: 0, max: 1000000000 };
    
    const scoredPromises = founders.map(async (f) => {
        const payload = {
            fundingRequirement: Number(f.fundingRequirement) || 0,
            fundingType: Array.isArray(f.fundingType) ? f.fundingType[0] : (f.fundingType || "Equity"),
            startupLocation: f.startupLocation || "",
            industry: f.industry || "",
            investment_min: range.min,
            investment_max: range.max,
            investmentInterest: investorProfile.investmentInterest || "",
            investmentType: Array.isArray(investorProfile.investmentType) ? investorProfile.investmentType[0] : (investorProfile.investmentType || "Equity"),
            investorLocation: investorProfile.investorLocation || ""
        };

        let mlScore = 0;
        try {
            const response = await axios.post("http://localhost:5001/predict", payload);
            let data = response.data;
            
            let rawScore = 0;
            
            if (data.result && data.result.probability) {
                const prob = data.result.probability;
                rawScore = (prob.class_1 !== undefined) ? prob.class_1 : (typeof prob === 'number' ? prob : 0);
            } else {
                rawScore = data.match_score !== undefined ? data.match_score : (data.match_success !== undefined ? data.match_success : 0);
            }

            if (rawScore > 0 && rawScore <= 1) {
                mlScore = Math.round(rawScore * 100);
            } else if (rawScore > 1) {
                mlScore = Math.round(rawScore);
            } else if (data.match_success === 1 || data.match_success === true || (data.result && data.result.prediction === 1)) {
                mlScore = 95;
            } else {
                mlScore = 15;
            }
        } catch (error) {
            console.error("ML API Error for founder", f._id, error.message);
            // Fallback to local heuristic
            mlScore = calculateMatchScore(f, investorProfile).score;
        }

        const obj = f.toObject();
        obj.matchScore = Math.min(100, Math.max(0, mlScore));
        obj.scoreBreakdown = { mlScore: obj.matchScore };
        return obj;
    });

    const scored = await Promise.all(scoredPromises);

    // 4. Sort descending by matchScore
    scored.sort((a, b) => b.matchScore - a.matchScore);

    return scored;
}

module.exports = {
    calculateMatchScore,
    getBestInvestorsForFounder,
    getBestFoundersForInvestor,
    parseFundingRange, // exported for testing
};
