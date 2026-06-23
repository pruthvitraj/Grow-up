// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

app.use(express.json());

// ✅ FIX CORS
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));

// ✅ FIXED mongoose connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Mongo connected');
    console.log("Connected DB:", mongoose.connection.name);

  })
  .catch(err => console.error(err));

// Socket.io Logic
let onlineUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
    io.emit('onlineUsers', Array.from(onlineUsers.keys()));
  });

  socket.on('sendMessage', (data) => {
    const { receiverId, message } = data;
    if (onlineUsers.has(receiverId)) {
      io.to(receiverId).emit('receiveMessage', message);
    }
    // Also emit notification
    if (onlineUsers.has(receiverId)) {
      io.to(receiverId).emit('notification', {
        type: 'message',
        content: `New message from ${message.senderName || 'someone'}`
      });
    }
  });

  socket.on('disconnect', () => {
    let disconnectedUserId;
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    console.log('User disconnected:', socket.id);
  });
});

app.use('/api/register', require('./routes/registerRoute'));
app.use('/api/login', require('./routes/loginRoute'));
app.use('/api/profile', require('./routes/profileRoute'));
app.use('/api/founder', require('./routes/founderRoute'));
app.use('/api/chat', require('./routes/chatRoute'));
app.use('/api/notifications', require('./routes/notificationRoute'));
app.use('/api/upload', require('./routes/uploadRoute'));
app.use('/api/appointments', require('./routes/appointmentRoute'));
app.use('/api/deals', require('./routes/dealRoute'));
app.use('/api/funding', require('./routes/fundingRoute'));
app.use('/api', require('./routes/connection'));
app.use('/api', require('./routes/watchlist'));
app.use('/api/investor', require('./routes/investorMatchRoute'));
// ✅ Admin Panel Routes
// app.use('/api/admin', require('./routes/adminRoute'));
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running ${PORT}`));
console.log('Connected to database:', process.env.MONGO_URI);