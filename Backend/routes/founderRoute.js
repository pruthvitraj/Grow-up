const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const InvestorProfile = require("../models/InvestorProfile");
const FounderProfile = require("../models/FounderProfile");
const User = require("../models/User");
const { getBestInvestorsForFounder } = require("../services/matchingService");


// ===================================================
// GET: Founder fetches all approved Investors
// URL: /api/founder/investors
// ===================================================
router.get("/investors", auth, async (req, res) => {
    try {
        if (req.user.role !== "founder") {
            return res.status(403).json({
                message: "Access denied. Founders only."
            });
        }

        const investors = await InvestorProfile.find()
            .populate({
                path: "user",
                match: { role: "investor", status: "approved" },
                select: "name email phone"
            })
            .select("-__v");

        const approvedInvestors = investors.filter(i => i.user !== null);
        // console.log(approvedInvestors);
        res.status(200).json(approvedInvestors);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


// ===================================================
// GET: AI-Matched Investors for a Founder
// URL: /api/founder/ai-matches
// ===================================================
router.get("/ai-matches", auth, async (req, res) => {
    try {
        if (req.user.role !== "founder") {
            return res.status(403).json({ message: "Access denied. Founders only." });
        }

        const results = await getBestInvestorsForFounder(req.user._id);
        return res.status(200).json(results);

    } catch (error) {
        console.error("AI match error (founder):", error.message);
        return res.status(500).json({ message: "Server error", detail: error.message });
    }
});


// ===================================================
// GET: Fetch Founder Profile by User ID
// URL: /api/founder/:userId
// ===================================================
router.get("/investor/:userId", auth, async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log("User ID:", userId);
        const user = await User.findById(userId).select("name email phone status");

        if (!user) return res.status(404).json({ message: "User not found" });

        // Fetch Investor Profile
        const profile = await InvestorProfile.findOne({ user: userId });

        if (!profile) return res.status(404).json({ message: "Profile not found" });
        // Merge both results
        const finalData = {
            fullName: user.name,
            email: user.email,
            phone: user.phone,
            status: user.status,
            ...profile._doc,
        };
        console.log("investor");
        console.log(finalData);
        res.json(finalData);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

//Showing Founder Profile
router.get("/:userId", auth, async (req, res) => {
    try {
        const userId = req.params.userId;
        const profile = await FounderProfile.findOne({ user: userId }).populate("user", "name email phone status meetingLink");

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Updating Founder Profile

router.put("/update", auth, async (req, res) => {
    try {
        // 🔐 Role protection
        if (req.user.role !== "founder") {
            return res.status(403).json({
                message: "Access denied. Founders only."
            });
        }

        const userId = req.user.id;

        // 🧹 Clean payload (extra safety)
        const payload = {
            ...req.body,
            user: userId
        };

        if (req.body.meetingLink !== undefined) {
            await User.findByIdAndUpdate(userId, { meetingLink: req.body.meetingLink });
        }

        // 🚀 Upsert profile (create if not exists, else update)
        const profile = await FounderProfile.findOneAndUpdate(
            { user: userId },
            payload,
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );
        await User.findByIdAndUpdate(
            userId,
            { status: "pending" },
            { new: true }
        );

        res.status(200).json({
            message: "Founder profile updated successfully",
            profile
        });

    } catch (error) {
        console.error("Founder update error:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router;
