const registerConnection = (io) => {
  io.on("connection", (socket) => {
    console.log("User connnected: ", socket.UserInfo);

    socket.use((packet, next) => {
      const now = Math.floor(Date.now() / 1000);

      if (socket.exp && socket.exp < now) {
        socket.emit("token-expired", ...packet);
        socket.disconnect();
        return next(new Error("Token expired"));
      }

      next();
    });

    socket.on("disconnect", () => {
      console.log("User disconnected: ", socket.id);
    });
  });
};

module.exports = registerConnection;