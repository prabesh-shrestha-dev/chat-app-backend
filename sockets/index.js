const registerConnection = require("./handlers/connectionHandler");
const socketAuth = require("./middleware/socketAuth")


const setupSockets = (io) => {
  io.use(socketAuth);

  registerConnection(io);
  
  io.on("connection", (socket) => {
    socket.on("send-message", (message, roomId) => {
      console.log(message, roomId)
      socket.to(roomId).emit("receive-message", message);
    })

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`${socket.UserInfo.firstName} with socketId ${socket.id} joined room ${roomId}`);
    })
  })
}

module.exports = setupSockets;