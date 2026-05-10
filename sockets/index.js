const registerConnection = require("./handlers/connectionHandler");
const socketAuth = require("./middleware/socketAuth")


const setupSockets = (io) => {
  io.use(socketAuth);

  registerConnection(io);
}

module.exports = setupSockets;