const express = require('express');
const router = express.Router();
const Chat = require('../models/chat'); // adjust the path as needed

router.post('/', async (req, res) => {
  const { userId, model = "meta-llama/llama-3-8b-instruct", messages = [] } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'User not found.' });
  }

  try {
    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter API error:", data);
      return res.status(response.status).json({ error: data });
    }

    const aiReply = data?.choices?.[0]?.message?.content || "No response.";

    // Save chat to DB or update existing chat (optional, based on your logic)
    // For example, create a new Chat document or append to existing one:
    const chat = new Chat({
      userId,
      title: 'Untitled Chat',
      messages: [
        ...messages, // incoming messages from user & system
        { role: 'assistant', content: aiReply }
      ]
    });

    await chat.save();

    res.status(200).json({ reply: aiReply });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
