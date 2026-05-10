const Message = require("../model/Message");

const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({
        message: 'ChatId required'
      });
    }

    const messages = await Message.find({ 
      chat: chatId
    })
    .sort({ createdAt: 1 })
    .exec();

    return res.json({ messages });
  } catch (err) {
    return res.status(500).json({
      message: `Server Error: ${err.message}`
    });
  }
}

const handleNewMessage = async (req, res) => {

  try {
    const userId = req.user?.id;
    const { chatId, message } = req.body;

    if (!chatId) {
      return res.status(400).json({
        message: 'ChatId required'
      })
    }

    if (!message) {
      return res.status(400).json({
        message: 'Message required'
      });
    }

    const newMessage = await Message.create({ chat: chatId, sender: userId, content: message });

    const io = res.app.get("io");
    io.to(chatId).emit("receive-message", newMessage, chatId);

    return res.json({ newMessage });
  } catch (err) {
    return res.status(500).json({
      message: `Server Error: ${err.message}`
    });
  }
};

module.exports = { getMessages, handleNewMessage };