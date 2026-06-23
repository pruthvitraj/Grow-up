const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Notification = require("../models/Notification");

/**
 * =====================================================
 * Send connection request
 * (Investor → Founder OR Founder → Investor)
 * =====================================================
 */
router.post("/request/:targetUserId", auth, async (req, res) => {
    try {
        const senderId = req.user.id;
        const { targetUserId } = req.params;

        if (senderId === targetUserId) {
            return res.status(400).json({ message: "You cannot request yourself" });
        }

        const sender = await User.findById(senderId);
        const receiver = await User.findById(targetUserId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: "User not found" });
        }

        // 🔒 Enforce Investor ↔ Founder only
        if (sender.role === receiver.role) {
            return res.status(400).json({
                message: "You can only connect with opposite roles"
            });
        }

        // Prevent duplicate sent request
        if (sender.sentRequests.some(r => r.userId.equals(targetUserId))) {
            return res.status(400).json({ message: "Request already sent" });
        }

        // Prevent duplicate received request
        if (receiver.receivedRequests.some(r => r.userId.equals(senderId))) {
            return res.status(400).json({ message: "Request already received" });
        }

        // Prevent duplicate connection
        if (sender.connections.some(c => c.userId.equals(targetUserId))) {
            return res.status(400).json({ message: "Already connected" });
        }

        // Save both sides
        sender.sentRequests.push({ userId: targetUserId });
        receiver.receivedRequests.push({ userId: senderId });

        await sender.save();
        await receiver.save();

        res.status(200).json({ message: "Connection request sent" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * =====================================================
 * Accept connection request
 * =====================================================
 */
router.post("/request/:senderId/accept", auth, async (req, res) => {
    try {
        const receiverId = req.user.id;
        const { senderId } = req.params;

        const receiver = await User.findById(receiverId);
        const sender = await User.findById(senderId);

        if (!receiver || !sender) {
            return res.status(404).json({ message: "User not found" });
        }

        const exists = receiver.receivedRequests.some(r =>
            r.userId.equals(senderId)
        );

        if (!exists) {
            return res.status(400).json({ message: "No request found" });
        }

        // Remove request
        receiver.receivedRequests = receiver.receivedRequests.filter(
            r => !r.userId.equals(senderId)
        );

        sender.sentRequests = sender.sentRequests.filter(
            r => !r.userId.equals(receiverId)
        );

        // Add connections to both
        receiver.connections.push({ userId: senderId });
        sender.connections.push({ userId: receiverId });

        await receiver.save();
        await sender.save();

        // Create a conversation for the new connection
        let conversation = await Conversation.findOne({
            participants: { $all: [receiverId, senderId] }
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [receiverId, senderId]
            });
            await conversation.save();
        }

        // Create a notification for the sender
        const notification = new Notification({
            recipient: senderId,
            sender: receiverId,
            type: 'connection',
            content: `${receiver.name} accepted your connection request. You can now start chatting.`
        });
        await notification.save();

        res.status(200).json({ message: "Connection accepted", conversationId: conversation._id });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * =====================================================
 * Reject connection request
 * =====================================================
 */
router.post("/request/:senderId/reject", auth, async (req, res) => {
    try {
        const receiverId = req.user.id;
        const { senderId } = req.params;

        const receiver = await User.findById(receiverId);
        const sender = await User.findById(senderId);

        receiver.receivedRequests = receiver.receivedRequests.filter(
            r => !r.userId.equals(senderId)
        );

        sender.sentRequests = sender.sentRequests.filter(
            r => !r.userId.equals(receiverId)
        );

        await receiver.save();
        await sender.save();

        res.status(200).json({ message: "Request rejected" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * =====================================================
 * Withdraw sent request
 * =====================================================
 */
router.post("/request/:targetUserId/withdraw", auth, async (req, res) => {
    try {
        const senderId = req.user.id;
        const { targetUserId } = req.params;

        const sender = await User.findById(senderId);
        const receiver = await User.findById(targetUserId);

        sender.sentRequests = sender.sentRequests.filter(
            r => !r.userId.equals(targetUserId)
        );

        receiver.receivedRequests = receiver.receivedRequests.filter(
            r => !r.userId.equals(senderId)
        );

        await sender.save();
        await receiver.save();

        res.status(200).json({ message: "Request withdrawn" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * =====================================================
 * Get connections
 * =====================================================
 */
router.get("/connections", auth, async (req, res) => {
    const user = await User.findById(req.user.id)
        .populate("connections.userId", "name email role");

    res.json(user.connections);
});

/**
 * =====================================================
 * Get received requests
 * =====================================================
 */
router.get("/requests", auth, async (req, res) => {
    const user = await User.findById(req.user.id)
        .populate("receivedRequests.userId", "name email role");

    res.json(user.receivedRequests);
});

/**
 * =====================================================
 * Get sent requests
 * =====================================================
 */
router.get("/requests/sent", auth, async (req, res) => {
    const user = await User.findById(req.user.id)
        .populate("sentRequests.userId", "name email role");

    res.json(user.sentRequests);
});


/**
 * =====================================================
 * Remove (disconnect) a connection
 * =====================================================
 */
router.post("/connection/:targetUserId/remove", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { targetUserId } = req.params;

        if (userId === targetUserId) {
            return res.status(400).json({ message: "Invalid operation" });
        }

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!user || !targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove each other from connections
        user.connections = user.connections.filter(
            c => !c.userId.equals(targetUserId)
        );

        targetUser.connections = targetUser.connections.filter(
            c => !c.userId.equals(userId)
        );

        await user.save();
        await targetUser.save();

        res.status(200).json({ message: "Connection removed successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
