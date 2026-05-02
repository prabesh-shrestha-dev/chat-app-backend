require('dotenv').config();

const express = require('express');
const app = express();
const PORT = 3000;

const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnection');

app.use(express.json());

app.use(cors(corsOptions));

app.use('/register', require('./routes/register'));

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