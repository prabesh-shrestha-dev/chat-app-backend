const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      'message': 'Invalid Authorization Header.'
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      'message': 'Invalid form of accessToken'
    })
  }
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(403).json({
          'message': err.message || "Invalid token."
        });
      }
      req.user = {
        id: decoded.UserInfo.id
      }
      next();
    }
  )
};

module.exports = verifyJWT;