const Funding = require("../models/Funding");
const Deal = require("../models/Deal");
const Notification = require("../models/Notification");

exports.createFunding = async (req, res) => {
    if (req.user.role !== 'investor') {
        return res.status(403).json({ message: "Only investors can create funding records" });
    }
    try {
        const {
            dealId,
            investorId,
            founderId,
            amount,
            transactionId,
            paymentMethod,
            proofDocument,
            notes,
            interest,
            term
        } = req.body;

        const funding = new Funding({
            dealId,
            investorId,
            founderId,
            amount,
            transactionId,
            paymentMethod,
            proofDocument,
            notes,
            interest,
            term
        });

        await funding.save();

        // Create Notification for the Founder
        const notification = new Notification({
            recipient: founderId,
            sender: req.user._id,
            type: 'deal',
            content: `New funding record submitted for your startup! Request No: ${funding.requestNo}`
        });
        await notification.save();

        res.status(201).json(funding);
    } catch (error) {
        console.error("Error in createFunding:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "Duplicate record: A funding record with this transaction ID already exists." });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: "Validation Error", errors: messages });
        }
        res.status(500).json({ message: "Error creating funding record", error: error.message });
    }
};

exports.getFundings = async (req, res) => {
    try {
        const userId = req.user._id;
        const role = req.user.role;

        let query = {};
        if (role === 'investor') {
            query = { investorId: userId };
        } else if (role === 'founder') {
            query = { founderId: userId };
        } else if (role === 'admin') {
            query = {}; // Admin sees all
        } else {
            return res.status(403).json({ message: "Access denied" });
        }

        const fundings = await Funding.find(query)
            .populate("investorId", "name email profileImagePath")
            .populate("founderId", "name email")
            .populate("dealId")
            .sort({ createdAt: -1 });

        res.status(200).json(fundings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching funding records", error: error.message });
    }
};

exports.updateFundingStatus = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Only administrators can verify funding status" });
    }
    try {
        const { id } = req.params;
        const { status } = req.body;

        const funding = await Funding.findById(id).populate("dealId investorId founderId");
        if (!funding) return res.status(404).json({ message: "Funding record not found" });

        funding.status = status;
        await funding.save();

        // If verified, we might want to update the deal as well
        if (status === 'verified') {
            const deal = await Deal.findById(funding.dealId);
            if (deal) {
                deal.status = 'funding_completed';
                await deal.save();

                // Notify both
                const notifInvestor = new Notification({
                    recipient: funding.investorId,
                    sender: req.user._id,
                    type: 'deal',
                    content: `Funding for ${deal.startupName} has been verified and completed! ✅`
                });
                const notifFounder = new Notification({
                    recipient: funding.founderId,
                    sender: req.user._id,
                    type: 'deal',
                    content: `Funding for your startup has been verified! Investment is complete. ✅`
                });
                await notifInvestor.save();
                await notifFounder.save();
            }
        }

        res.status(200).json(funding);
    } catch (error) {
        res.status(500).json({ message: "Error updating funding status", error: error.message });
    }
};
