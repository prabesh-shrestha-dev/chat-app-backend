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
    })

    socket.on("disconnect", () => {
      console.log("User disconnected: ", socket.UserInfo, socket.id);
    });
  });
};

module.exports = registerConnection;