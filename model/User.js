const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  phoneNumber: {
    type: String, 
    required: true
  },
  password: {
    type: String, 
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  middleName: {
    type: String
  },
  lastName: {
    type: String,
    required: true
  },
  refreshToken: String
});

module.exports = mongoose.model('User', userSchema);