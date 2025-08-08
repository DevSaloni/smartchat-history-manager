const Chat = require("../models/Chat");
const User = require('../models/userModel');
// Save user message and response
const saveMessage = async (req, res) => {
  try {
    const { userId, title, messages } = req.body;

    // Check for empty content
    if (!messages || messages.length === 0 || !messages[0].content) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    const chat = new Chat({
      userId,
      title: title || 'New Chat',
      messages
    });

    await chat.save();
    res.status(200).json({ message: 'Chat saved successfully', chat });
  } catch (error) {
    console.error('Save Message Error:', error);
    res.status(500).json({ error: 'Failed to save chat' });
  }
};


// Get all recent chats (titles) for a user
const getAllChats = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const chats = await Chat.find({ userId })
      .sort({ createdAt: -1 })
      .select('title createdAt messages');

    res.status(200).json(chats || []); // always return array
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.status(200).json(chat);  // returns full chat including messages array
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const addMessageToChat = async (req, res) => {
  try {
    const { role, content } = req.body;
    const { chatId } = req.params;

    if (!role || !content) {
      return res.status(400).json({ error: 'Both role and content are required.' });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found.' });
    }

    chat.messages.push({ role, content });
    await chat.save();

    res.status(200).json({ message: 'Message added to chat.', chat });
  } catch (error) {
    console.error('Add Message Error:', error);
    res.status(500).json({ error: 'Failed to add message.' });
  }
};

//delete the chats
const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const deleted = await Chat.findByIdAndDelete(chatId);

    if (!deleted) {
      return res.status(404).json({ message: 'Chat not found.' });
    }

    res.status(200).json({ message: 'Chat deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




const sendMessage = async (req, res) => {
  const { userId, chatId, message } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'User not found.', code: 401 });
  }

  // Check user existence
  const user = await User.findById(userId);
  if (!user) {
    return res.status(401).json({ message: 'User not found.', code: 401 });
  }

  // Find chat
  const chat = await Chat.findById(chatId);
  if (!chat) return res.status(404).json({ message: 'Chat not found.' });

  // Compare ObjectIds properly
  if (!chat.userId.equals(mongoose.Types.ObjectId(userId))) {
    return res.status(403).json({ message: 'Unauthorized access to chat.' });
  }

  if (chat.title === 'Start your conversation here...') {
    chat.title = message.content.slice(0, 40);
  }

  chat.messages.push(message);
  await chat.save();

  res.status(200).json({ chat });
};


// Update chat title
const updateChatTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    const chat = await Chat.findById(id);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found.' });
    }

    chat.title = title;
    await chat.save();

    res.status(200).json({ message: 'Title updated successfully.', chat });
  } catch (err) {
    console.error('Update Title Error:', err);
    res.status(500).json({ error: 'Failed to update title.' });
  }
};

// Search chats by title
const searchChats = async (req, res) => {
  try {
    const { query } = req.params;

    const chats = await Chat.find({
      title: { $regex: query, $options: 'i' }, 
    });

    res.status(200).json(chats);
  } catch (err) {
    console.error('Search Error:', err);
    res.status(500).json({ error: 'Failed to search chats.' });
  }
};

//archieved chat handle
const handleArchiveChat = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndUpdate(
      req.params.chatId,
      { isArchived: true , archivedAt: new Date()},
      { new: true }
    );
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    res.json({ message: 'Chat archived', chat });
  } catch (err) {
    res.status(500).json({ error: 'Failed to archive chat' });
  }
};

const getArchiveChat = async (req, res) => {
  try {
    const { userId } = req.params;
    const archivedChats = await Chat.find({ userId, isArchived: true }).sort({ createdAt: -1 });
    res.json(archivedChats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch archived chats' });
  }
};

const restoreChat = async(req,res) =>{
  try {
    const chat = await Chat.findByIdAndUpdate(req.params.chatId, { isArchived: false }, { new: true });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: 'Failed to restore chat' });
  }
}

/// summarized the chat 
const summarizeChat = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chatData = await Chat.findById(chatId);

    if (!chatData) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const messagesText = chatData.messages
      .map((msg) => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`)
      .join('\n');

    const prompt = `Summarize the following chat:\n\n${messagesText}`;

    const apiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        'Authorization': 'Bearer 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',
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct", 
        messages: [
          { role: "system", content: "You are a helpful assistant that summarizes chat." },
          { role: "user", content: prompt }
        ]
      })
    });

    const summaryData = await apiResponse.json();

    if (!apiResponse.ok) {
      console.error("OpenRouter Error:", summaryData);
      return res.status(500).json({ error: "Failed to summarize from OpenRouter" });
    }

    const summary = summaryData.choices?.[0]?.message?.content || "No summary returned.";
    res.status(200).json({ summary });
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ error: "Failed to generate summary" });
  }
};

module.exports = {
  saveMessage,
  getAllChats,
  getChatById,
  addMessageToChat,
  deleteChat,
  sendMessage,
  updateChatTitle,
  searchChats,
  handleArchiveChat,
  getArchiveChat,
  restoreChat,
  summarizeChat,
};
