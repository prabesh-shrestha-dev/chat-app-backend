const jwt = require('jsonwebtoken');
const User = require('../model/User');

const handleRefreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;

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
  
  const userId = foundUser._id.toString();

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || userId !== decoded.UserInfo.id ) {
        return res.status(403).json({
          'message': err?.message || 'Invalid UserInfo.'
        });
      }
      const accessToken = jwt.sign(
        {
          "UserInfo": { id: userId }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );
      return res.json({ accessToken, userId });
    }
  )
};

module.exports = { handleRefreshToken };