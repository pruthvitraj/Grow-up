const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const chatController = require('../controllers/chatController');

router.post('/conversation', auth, chatController.getConversation);
router.post('/send', auth, chatController.sendMessage);
router.get('/conversations', auth, chatController.getConversations);
router.get('/messages/:conversationId', auth, chatController.getMessages);

module.exports = router;
