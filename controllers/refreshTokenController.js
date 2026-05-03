const jwt = require('jsonwebtoken');
const User = require('../model/User');

const handleRefreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  console.log(refreshToken);

  if (!refreshToken) {
    return res.status(401).json({
      'message': 'Invalid or no refreshToken.'
    })
  }

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    return res.status(403).json({
      'message': 'RefreshToken not available.'
    });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || foundUser.phoneNumber !== decoded.UserInfo.phoneNumber ) {
        return res.status(403).json({
          'message': err?.message || 'Invalid UserInfo.'
        });
      }
      const { firstName, middleName, lastName } = foundUser;
      const accessToken = jwt.sign(
        {
          "UserInfo": { phoneNumber: decoded.UserInfo.phoneNumber, firstName, middleName, lastName }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10s' }
      );
      return res.json({ accessToken });
    }
  )
};

module.exports = { handleRefreshToken };