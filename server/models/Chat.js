const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, default: 'Untitled Chat' },
  messages: [
    {
   role: { type: String, enum: ['user', 'assistant'], required: true },
      content: { type: String, required: true }
    }
  ],
  isArchived: { type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);
