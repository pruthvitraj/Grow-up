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

router.get("/investor/founders", auth, async (req, res) => {
    try {
        if (req.user.role !== "investor") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const founderUsers = await User.find({ role: "founder" })
            .select("_id name email phone");
        console.log(founderUsers);
        const founderIds = founderUsers.map(u => u._id);

        const founders = await FounderProfile.find({
            user: { $in: founderIds }
        }).populate("user", "name email phone");
        console.log(founders);

        res.json(founders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/investor/:userId", auth, async (req, res) => {
    try {
        const userId = req.params.userId;

        // Fetch User (name, email, phone)
        const user = await User.findById(userId).select("name email phone status meetingLink");

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


router.put("/investor/update", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("Update request for user:", userId);
        // Build update object safely
        const updateFields = {};

        const fields = [
            "investorprofilePhoto",
            "jobStatus",
            "investmentRange",
            "investmentActiveness",
            "investmentInterest",
            "investorLocation",
            "investmentType",
            "pan",
            "investorLinkedin",
            "proofOfFunds",
            "kycId",
            "notificationPreference",
            "communicationPreference",
            "acceptTerms",
        ];

        fields.forEach((field) => {
            if (req.body[field] !== undefined && req.body[field] !== "") {
                updateFields[field] = req.body[field];
            }
        });

        if (req.body.meetingLink !== undefined) {
            await User.findByIdAndUpdate(userId, { meetingLink: req.body.meetingLink });
        }

        const updatedProfile = await InvestorProfile.findOneAndUpdate(
            { user: userId },
            {
                $set: updateFields,
                $setOnInsert: { user: userId }, // ✅ FIXED
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        );
        await User.findByIdAndUpdate(
            userId,
            { status: "pending" },
            { new: true }
        );

        res.json({
            message: "Investor profile updated & sent for review",
            profile: updatedProfile,
        });

    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Update failed" });
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
        console.log(profile);
        res.json(profile);
    } catch (err) { res.status(500).send('Server error'); }
});
// GET Founder Profile
router.get("/founder/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;

        const profile = await FounderProfile
            .findById(id)
            .populate("user", "name email phone");

        if (!profile) {
            return res.status(404).json({ message: "Founder profile not found" });
        }
        console.log("founder");
        console.log(profile);
        res.json(profile);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// specific route for watchlist to get founder profiles beacuse i'm make mistake in id's

// router.get("/startup/watchlist/:userId", auth, async (req, res) => {
//     try {
//         const userId = req.params.userId;

//         // Fetch User (name, email, phone)
//         const user = await User.findById(userId).select("name email phone status");

//         if (!user) return res.status(404).json({ message: "User not found" });

//         // Fetch Investor Profile
//         const profile = await FounderProfile.findOne({ user: userId });

//         if (!profile) return res.status(404).json({ message: "Profile not found" });
//         // Merge both results
//         const finalData = {
//             fullName: user.name,
//             email: user.email,
//             phone: user.phone,
//             status: user.status,
//             ...profile._doc,
//         };
//         console.log("founder");
//         console.log(finalData);
//         res.json(finalData);

//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Server error");
//     }
// });

router.put('/update-meeting-link', auth, async (req, res) => {
    try {
        const { meetingLink } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { meetingLink },
            { new: true }
        );
        res.json({ message: 'Meeting link updated', meetingLink: user.meetingLink });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
