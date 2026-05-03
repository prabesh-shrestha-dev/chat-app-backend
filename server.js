require('dotenv').config();

const express = require('express');
const app = express();
const PORT = 3000;

const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnection');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/refresh', require('./routes/refresh'));

app.use(verifyJWT);

app.get('/home', (req, res) => {
  res.json({ phoneNumber: req.phoneNumber, firstName: req.firstName });
});

const startServer = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB.');
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}...`);
    })
  } catch (err) {
    console.error('MongoDB error: ', err);
    process.exit(1);
  }
}

startServer();