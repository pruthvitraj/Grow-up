// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(express.json());

// ✅ FIX CORS
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

// ✅ FIXED mongoose connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Mongo connected'))
    .catch(err => console.error(err));

app.use('/api/register', require('./routes/registerRoute'));
app.use('/api/login', require('./routes/loginRoute'));
app.use('/api/profile', require('./routes/profileRoute'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running ${PORT}`));
