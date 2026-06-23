const mongoose = require("mongoose");
const Deal = require("../models/Deal");
const Appointment = require("../models/Appointment");
const Notification = require("../models/Notification");

exports.createDeal = async (req, res) => {
    try {
        const {
            startupName,
            investmentAmount,
            equityPercentage,
            message,
            appointmentId
        } = req.body;

        console.log("Create Deal Request Body:", req.body);
        console.log("User from Auth:", req.user._id, req.user.role);

        if (req.user.role !== 'investor') {
            return res.status(403).json({ message: "Only investors can create a deal proposal" });
        }

        const investorId = req.user._id;
        const founderId = req.body.founderId || req.body.participantId;

        console.log("Calculated IDs:", { investorId, founderId });

        if (!investorId || !founderId) {
            return res.status(400).json({ message: "Missing investorId or founderId" });
        }

        const deal = new Deal({
            investorId,
            founderId,
            startupName: startupName ? startupName.trim() : "Unnamed Startup",
            investmentAmount: Number(investmentAmount) || 0,
            equityPercentage: Number(equityPercentage) || 0,
            message: message ? message.trim() : "",
            appointmentId: (appointmentId && mongoose.Types.ObjectId.isValid(appointmentId)) ? appointmentId : null
        });

        await deal.save();
        res.status(201).json(deal);
    } catch (error) {
        console.error("Deal Creation Error:", error);
        res.status(500).json({ message: "Error creating deal", error: error.message });
    }
};

exports.getDeals = async (req, res) => {
    try {
        const userId = req.user._id;
        const role = req.user.role;

        let query = {};
        if (role === 'investor') {
            query = { investorId: userId };
        } else {
            query = { founderId: userId };
        }

        const deals = await Deal.find(query)
            .populate("investorId", "name email")
            .populate("founderId", "name email")
            .populate("appointmentId", "title date time")
            .sort({ createdAt: -1 });

        res.status(200).json(deals);
    } catch (error) {
        res.status(500).json({ message: "Error fetching deals", error: error.message });
    }
};

exports.updateDealStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, message } = req.body;

        const deal = await Deal.findById(id).populate("investorId founderId");
        if (!deal) return res.status(404).json({ message: "Deal not found" });

        const isInvestor = deal.investorId._id.toString() === req.user._id.toString();
        const isFounder = deal.founderId._id.toString() === req.user._id.toString();

        if (!isInvestor && !isFounder) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Logic for role-based status updates
        if (deal.status === 'pending') {
            if (!['accepted', 'rejected'].includes(status)) {
                return res.status(400).json({ message: "Invalid status transition from pending" });
            }
            if (!isFounder) {
                return res.status(403).json({ message: "Only the founder can accept or reject the proposal" });
            }
        } else if (deal.status === 'accepted') {
            if (status !== 'funding_in_progress') {
                return res.status(400).json({ message: "Invalid status transition from accepted" });
            }
            if (!isInvestor) {
                return res.status(403).json({ message: "Only the investor can start the funding process" });
            }
        } else if (deal.status === 'funding_in_progress') {
            if (status !== 'funding_completed') {
                return res.status(400).json({ message: "Invalid status transition from funding_in_progress" });
            }
            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: "Only administrators can mark funding as completed" });
            }
        }

        deal.status = status;
        if (message) deal.message = message;

        await deal.save();

        // Create Notification
        const recipientId = isInvestor ? deal.founderId._id : deal.investorId._id;
        const senderName = isInvestor ? deal.investorId.name : deal.founderId.name;

        let notificationContent = "";
        switch (status) {
            case 'accepted': notificationContent = `${senderName} accepted the deal for ${deal.startupName}!`; break;
            case 'rejected': notificationContent = `${senderName} rejected the deal for ${deal.startupName}.`; break;
            case 'funding_in_progress': notificationContent = `${senderName} has initiated the funding process for ${deal.startupName}.`; break;
            case 'funding_completed': notificationContent = `Funding completed! ${senderName} successfully invested in ${deal.startupName} ✅`; break;
            default: notificationContent = `Deal status for ${deal.startupName} updated to ${status}.`;
        }

        const notification = new Notification({
            recipient: recipientId,
            sender: req.user._id,
            type: 'deal',
            content: notificationContent
        });
        await notification.save();

        res.status(200).json(deal);
    } catch (error) {
        res.status(500).json({ message: "Error updating deal status", error: error.message });
    }
};

exports.getDealById = async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id)
            .populate("investorId", "name email")
            .populate("founderId", "name email")
            .populate("appointmentId");

        if (!deal) return res.status(404).json({ message: "Deal not found" });
        res.status(200).json(deal);
    } catch (error) {
        res.status(500).json({ message: "Error fetching deal", error: error.message });
    }
};
