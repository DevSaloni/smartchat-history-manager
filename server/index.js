const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv =  require('dotenv');

dotenv.config();

//routes
const authRoute = require("./routes/auth");
const openaiRouter = require("./routes/openai");
const chatRoute = require("./routes/ChatRoute");

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true
}));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(express.json());
app.use('/api/auth' ,authRoute);
app.use('/api/v1/chat', openaiRouter);
app.use('/api/chats', chatRoute);


//mongoose connection
mongoose.connect(process.env.MONGO_URI).
then(() =>{
app.listen(process.env.PORT,() =>{
    console.log("mongodb connected successfully");
    console.log(`Server running on port ${process.env.PORT}`);
})
}).catch(err =>{
    console.error(err);
});
