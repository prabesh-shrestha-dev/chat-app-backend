const Message = require("../../model/Message");

const registerConnection = (io) => {
  io.on("connection", (socket) => {
    console.log("User connnected: ", socket.UserInfo, socket.id);

    // AccessToken validity test before every socketEvent
    // socket.use((packet, next) => {
    //   const now = Math.floor(Date.now() / 1000);

    //   if (socket.exp && socket.exp < now) {
    //     socket.emit("token-expired", ...packet);
    //     socket.disconnect();
    //     return next(new Error("Token expired"));
    //   }

    //   next();
    // });

    // Join to the room with own's userId
    socket.join(socket.UserInfo.id);

    socket.on("join-room", (roomId) => {
      console.log(`Room joined.`)
      socket.join(roomId);
    });

    socket.on("leave-room", (roomId) => {
      console.log('Room left');
      socket.leave(roomId);
    });

    socket.on("typing", (roomId) => {
      socket.to(roomId).emit("receive-typing");
    });

    socket.on("not-typing", (roomId) => {
      socket.to(roomId).emit("receive-not-typing");
    });

    socket.on("seen", async (chatId, userId) => {

      const foundMessage = await Message
        .findOne({ chat: chatId })
        .sort({ createdAt: -1 })
        .exec();
      
      if (!foundMessage) return;

      if (userId === foundMessage.sender.toString()) return;

      foundMessage.readBy.push(userId);
      await foundMessage.save();

      socket.to(chatId).emit("seen-message", foundMessage?._id);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected: ", socket.UserInfo, socket.id);
    });
  });
};

module.exports = registerConnection;