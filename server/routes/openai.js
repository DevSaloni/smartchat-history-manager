const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: message }],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter API error:", data);
      return res.status(response.status).json({ error: data });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
