// routes/profileRoute.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const InvestorProfile = require('../models/InvestorProfile');
const FounderProfile = require('../models/FounderProfile');
const User = require('../models/User');

router.post("/watchlist/:founderId", auth, async (req, res) => {
    try {
        const investorId = req.user.id;
        const { founderId } = req.params;
        // 1️⃣ Find investor
        const investor = await User.findById(investorId);
        if (!investor) {
            return res.status(404).json({ message: "Investor not found" });
        }
        const profile = await FounderProfile.findOne({ user: investorId });
        
        // 2️⃣ Only investors can have watchlist
        if (investor.role !== "investor") {
            return res.status(403).json({ message: "Only investors can add to watchlist" });
        }

        // 3️⃣ Check founder exists
        const founder = await User.findById(founderId);
        if (!founder || founder.role !== "founder") {
            return res.status(404).json({ message: "Founder not found" });
        }

        // 4️⃣ Prevent duplicate entries
        if (investor.watchlist.includes(founderId)) {
            return res.status(400).json({ message: "Founder already in watchlist" });
        }

        // 5️⃣ Add to watchlist
        investor.watchlist.push(founderId);
        await investor.save();

        // 6️⃣ Success response
        res.status(200).json({
            message: "Founder added to watchlist successfully",
            watchlist: investor.watchlist
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


// Founder watchlist route
router.post("/founder/watchlist/:investorId", auth, async (req, res) => {
    try {
        const founderId = req.user.id;
        const { investorId } = req.params;

        // 1️⃣ Find founder
        const founder = await User.findById(founderId);
        if (!founder) {
            return res.status(404).json({ message: "Founder not found" });
        }

        // 2️⃣ Only founders can have watchlist
        if (founder.role !== "founder") {
            return res.status(403).json({ message: "Only founders can add to watchlist" });
        }

        // 3️⃣ Check investor exists
        const investor = await User.findById(investorId);
        if (!investor || investor.role !== "investor") {
            return res.status(404).json({ message: "Investor not found" });
        }

        // 4️⃣ Prevent duplicate entries
        if (founder.watchlist.includes(investorId)) {
            return res.status(400).json({ message: "Investor already in watchlist" });
        }

        // 5️⃣ Add to watchlist
        founder.watchlist.push(investorId);
        await founder.save();

        // 6️⃣ Success response
        res.status(200).json({
            message: "Investor added to watchlist successfully",
            watchlist: founder.watchlist
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/watchlist", auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // 1️⃣ Get logged-in user with watchlist populated
        const currentUser = await User.findById(userId)
            .populate("watchlist", "name email role");

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2️⃣ Extract valid user IDs from watchlist
        const userIds = currentUser.watchlist.map(u => u._id);

        // 3️⃣ Choose profile model based on role
        let profiles = [];

        if (currentUser.role === "investor") {
            // Investor → watching founders
            profiles = await FounderProfile.find({
                user: { $in: userIds }
            });
        } else if (currentUser.role === "founder") {
            // Founder → watching investors
            profiles = await InvestorProfile.find({
                user: { $in: userIds }
            });
        } else {
            return res.status(403).json({ message: "Invalid user role" });
        }
        console.log("Fetched profiles for watchlist:", profiles);
        // 4️⃣ Merge user + profile data
        const watchlist = currentUser.watchlist.map(user => {
            const profile = profiles.find(
                p => p.user.toString() === user._id.toString()
            );

            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,

                // unified image field for frontend
                profileImagePath:
                    currentUser.role === "investor"
                        ? profile?.productImageUrl || ""          // FounderProfile
                        : profile?.investorprofilePhoto || "",    // InvestorProfile
            };
        });

        res.status(200).json({ watchlist });

    } catch (error) {
        console.error("WATCHLIST ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
});
// to remove the user from watchlist
router.delete("/watchlist/:userId", auth, async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const { userId } = req.params;
        // 1️⃣ Find current user
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // 2️⃣ Check if userId is in watchlist
        const index = currentUser.watchlist.indexOf(userId);
        if (index === -1) {
            return res.status(400).json({ message: "User not in watchlist" });
        }
        // 3️⃣ Remove from watchlist

        currentUser.watchlist.splice(index, 1);
        await currentUser.save();
        // 4️⃣ Success response
        res.status(200).json({
            message: "User removed from watchlist successfully",
            watchlist: currentUser.watchlist
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
module.exports = router;