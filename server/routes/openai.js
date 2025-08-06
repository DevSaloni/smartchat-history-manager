const express = require('express');
const router = express.Router();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

router.post('/chat', async (req, res) => {
  const { model = 'meta-llama/llama-3-8b-instruct', messages = [] } = req.body;

  try {
   const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://yourfrontend.onrender.com", // correct domain
    "X-Title": "chat-ui",
  },
  body: JSON.stringify({
    model: "mistralai/mixtral-8x7b",
    messages: [{ role: "user", content: message }],
  }),
});


    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      console.error('Invalid response from OpenRouter:', data);
      res.status(500).json({ error: 'No response from AI' });
    }

  } catch (error) {
    console.error('OpenRouter API error:', error);
    res.status(500).json({ error: 'Error communicating with OpenRouter API' });
  }
});

module.exports = router;
