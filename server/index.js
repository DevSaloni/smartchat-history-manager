const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load .env before anything else
dotenv.config();

// routes
const authRoute = require("./routes/auth");
const openaiRouter = require("./routes/openai"); // handles OpenRouter API calls
const chatRoute = require("./routes/ChatRoute");

const app = express();

// CORS setup
app.use(cors({
  origin: process.env.FRONTEND_URL || "*", // fallback for testing
  credentials: true
}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Middleware
app.use(express.json());

// API routes
app.use('/api/auth', authRoute);
app.use('/api/v1/chat', openaiRouter);
app.use('/api/chats', chatRoute);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB connected successfully");
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
})
.catch(err => {
  console.error("MongoDB connection error:", err);
});
