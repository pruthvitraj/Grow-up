// routes/profileRoute.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const InvestorProfile = require('../models/InvestorProfile');
const FounderProfile = require('../models/FounderProfile');
const User = require('../models/User');

// Create or update investor profile
router.post('/investor', auth, async (req, res) => {
    try {
        if (req.user.role !== 'investor') return res.status(403).send('Forbidden');
        const data = { user: req.user._id, ...req.body };
        let profile = await InvestorProfile.findOne({ user: req.user._id });
        if (profile) {
            profile = await InvestorProfile.findOneAndUpdate({ user: req.user._id }, data, { new: true });
        } else {
            profile = new InvestorProfile(data);
            await profile.save();
        }
        req.user.isProfileComplete = true;
        await req.user.save();
        res.json(profile);
    } catch (err) { res.status(500).send('Server error'); }
});

router.get("/investor/:userId", auth, async (req, res) => {
    try {
        const userId = req.params.userId;

        // Fetch User (name, email, phone)
        const user = await User.findById(userId).select("name email phone");

        if (!user) return res.status(404).json({ message: "User not found" });

        // Fetch Investor Profile
        const profile = await InvestorProfile.findOne({ user: userId });

        if (!profile) return res.status(404).json({ message: "Profile not found" });

        // Merge both results
        const finalData = {
            fullName: user.name,
            email: user.email,
            phone: user.phone,
            ...profile._doc,
        };

        res.json(finalData);

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

router.put("/investor/update", auth, async (req, res) => {
    try {
        const userId = req.body.userId;

        // Update basic (User model)
        await User.findByIdAndUpdate(userId, {
            name: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            status: "pending" // send for review
        });

        // Update investor profile
        const updated = await InvestorProfile.findOneAndUpdate(
            { user: userId },
            { $set: req.body },
            { new: true }
        );

        res.json({ message: "Updated & sent for review", updated });

    } catch (err) {
        console.error(err);
        res.status(500).send("Update failed");
    }
});

// Create or update founder profile
router.post('/founder', auth, async (req, res) => {
    try {
        if (req.user.role !== 'founder') return res.status(403).send('Forbidden');
        const data = { user: req.user._id, ...req.body };
        let profile = await FounderProfile.findOne({ user: req.user._id });
        if (profile) {
            profile = await FounderProfile.findOneAndUpdate({ user: req.user._id }, data, { new: true });
        } else {
            profile = new FounderProfile(data);
            await profile.save();
        }
        req.user.isProfileComplete = true;
        await req.user.save();
        res.json(profile);
    } catch (err) { res.status(500).send('Server error'); }
});

router.get("/investor/founders", auth, async (req, res) => {
    try {
        if (req.user.role !== "investor") {
            return res.status(403).send("Forbidden");
        }

        // 1. Find all users who are founders
        const founderUsers = await User.find({ role: "founder" }).select("_id name email phone");

        const founderIds = founderUsers.map((u) => u._id);

        // 2. Find founder profiles for those users
        const founders = await FounderProfile.find({
            user: { $in: founderIds },
        }).populate("user", "name email phone");
        console.log(founders);

        res.json(founders);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});
module.exports = router;
