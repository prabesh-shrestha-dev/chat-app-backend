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
          'message': err.message
        });
      }
      req.phoneNumber = decoded.UserInfo.phoneNumber;
      req.firstName = decoded.UserInfo.firstName;
      req.middleName = decoded.UserInfo.middleName;
      req.lastName = decoded.UserInfo.lastName;
      next();
    }
  )
};

module.exports = verifyJWT;