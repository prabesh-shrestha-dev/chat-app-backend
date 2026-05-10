require('dotenv').config();

const express = require('express');
const app = express();
const PORT = 3000;

const http = require('http');
const { Server } = require('socket.io');

const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnection');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const setupSockets = require('./sockets');

// Create HTTP server
const server = http.createServer(app);

// Attach socket.io
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://192.168.18.136:5173"
    ],
    methods: ["GET", "POST"]
  }
});

setupSockets(io);
app.set("io", io);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);

const User = require('./model/User');
app.get('/home', async (req, res) => {

  const foundUser = await User.findOne({ _id: req.user.id }).exec();
  res.json({ phoneNumber: foundUser.phoneNumber, firstName: foundUser.firstName });
});

app.use('/chats', require('./routes/chats'));
app.use('/message', require('./routes/message'));

const startServer = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB.');
    server.listen(PORT, () => {
      console.log(`App listening on port ${PORT}...`);
    })
  } catch (err) {
    console.error('MongoDB error: ', err);
    process.exit(1);
  }
}

startServer();