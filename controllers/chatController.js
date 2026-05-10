const Chat = require('../model/Chat');
const User = require('../model/User');

const getChatList = async (req, res) => {
  try {
    const userId = req.user?.id;
    const chats = await Chat.find({ 
      users: userId 
    })
      .sort({ latestMessageAt: -1 })
      .populate('users', 'firstName middleName lastName phoneNumber')
      .populate({
        path: 'latestMessage',
        populate: {
          path: 'sender',
          select: 'firstName middleName lastName'
        }
      })
      .exec();

    return res.json({ chats });
  } catch (err) {
    return res.status(500).json({
      message: `Server Error: ${err.message}`
    });
  }
};

const handleCreateChat = async (req, res) => {

  try {
    const userId = req.user?.id;
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({
        message: "Phone number required"
      });
    }
    
    const foundUser = await User.findOne({ phoneNumber }).exec();
    if (!foundUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const foundUserId = foundUser._id.toString();

    if (foundUserId === userId) {
      return res.status(400).json({
        message: "Cannot create chat with yourself"
      });
    }

    const existingChat = await Chat.findOne({
      users: { $all: [userId, foundUserId] },
      type: "Private"
    });

    if (existingChat) {
      return res.status(409).json({
        message: "Chat already exists"
      })
    }

    const chat = await Chat.create({
      users: [userId, foundUserId],
      latestMessageAt: new Date()
    })

    const populatedChat = await Chat.findOne({ 
      _id: chat._id
     })
      .populate('users', 'firstName middleName lastName phoneNumber')
      .exec();

    const io = req.app.get("io");
    io.to(userId).emit("chat-created", populatedChat);

    return res.status(201).json({
      message: `Successful chat creation with ${foundUser._id} by ${userId}`
    })
  } catch (err) {
    return res.status(500).json({
      message: `Server Error: ${err.message}`
    })
  } 
};

module.exports = { getChatList, handleCreateChat };