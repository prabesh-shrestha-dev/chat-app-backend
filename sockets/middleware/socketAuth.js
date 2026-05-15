const jwt = require('jsonwebtoken');

const socketAuth = (socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("NO_TOKEN"))
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    socket.UserInfo = decoded.UserInfo;
    // socket.exp = decoded.exp;
    next();
  } catch (err) {
    return next(new Error("INVALID_TOKEN"));
  }
};

module.exports = socketAuth;