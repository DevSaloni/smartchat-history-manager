const express = require('express');
const router = express.Router();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

router.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch('https://smartchat-history-manager.onrender.com/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
       model: 'meta-llama/llama-3-8b-instruct',// you can choose other free models from openrouter docs
        messages: [{ role: 'user', content: message }],
      }),
    });

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: 'No response from AI' });
    }

  } catch (error) {
    console.error('OpenRouter API error:', error);
    res.status(500).json({ error: 'Error communicating with OpenRouter API' });
  }
});

module.exports = router;
