const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Notification = require('../models/Notification');

// Get or create conversation
exports.getConversation = async (req, res) => {
    try {
        const { receiverId } = req.body;
        const senderId = req.user.id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, receiverId]
            });
            await conversation.save();
        }

        res.status(200).json(conversation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Send message
exports.sendMessage = async (req, res) => {
    try {
        const { conversationId, receiverId, content, messageType, fileUrl, fileType } = req.body;
        const senderId = req.user.id;

        const newMessage = new Message({
            conversationId,
            sender: senderId,
            receiver: receiverId,
            content,
            messageType,
            fileUrl,
            fileType
        });

        await newMessage.save();

        // Update conversation last message
        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: newMessage._id,
            updatedAt: Date.now()
        });

        // Create notification
        const notification = new Notification({
            recipient: receiverId,
            sender: senderId,
            type: 'message',
            content: `New message from ${req.user.name}`
        });
        await notification.save();

        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all conversations for user
exports.getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        const conversations = await Conversation.find({
            participants: { $in: [userId] }
        })
            .populate('participants', 'name role')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });

        res.status(200).json(conversations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get messages for a conversation
exports.getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await Message.find({ conversationId })
            .sort({ createdAt: 1 });

        // Mark as seen
        await Message.updateMany(
            { conversationId, receiver: req.user.id, isSeen: false },
            { $set: { isSeen: true } }
        );

        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
