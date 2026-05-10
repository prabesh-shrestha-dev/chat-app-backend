const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new Schema({
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  type: {
    type: String,
    enum: ['Private', 'Group'],
    default: 'Private'
  },
  latestMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  },
  latestMessageAt: {
    type: Date
  },
  name: {
    type: String,
    trim: true
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

chatSchema.index({ users: 1 });

module.exports = mongoose.model('Chat', chatSchema);