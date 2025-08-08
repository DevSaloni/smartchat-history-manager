const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {
  const { model = "meta-llama/llama-3-8b-instruct", messages = [] } = req.body;

  try {
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

    // Send only the reply content to frontend
    const aiReply = data?.choices?.[0]?.message?.content || "No response.";
    res.status(200).json({ reply: aiReply });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
