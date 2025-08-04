const express = require('express');
const router = express.Router();
const chatController = require('../controllers/ChatController');

//  Save message (new or existing chat)
router.post('/save-message', chatController.saveMessage);

router.post('/send-message', chatController.sendMessage);

//  Get all recent chats by user
router.get('/all/:userId', chatController.getAllChats);

router.get('/:chatId', chatController.getChatById);

// /  Add message to existing chat
router.post('/message/:chatId', chatController.addMessageToChat); 

//delete chat
router.delete('/:chatId', chatController.deleteChat); 

router.put('/update-title/:id', chatController.updateChatTitle); 

//search
router.get('/search/:query', chatController.searchChats); 

//archive chat
router.put('/archive-chat/:chatId', chatController.handleArchiveChat);
router.get('/archived-chats/:userId', chatController.getArchiveChat);

//restore chat 
router.put('/restore-chat/:chatId', chatController.restoreChat);


//summarize chat
router.get('/summarize/:chatId', chatController.summarizeChat);

module.exports = router;
