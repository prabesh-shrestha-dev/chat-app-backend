const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return res.status(400).json({
      message: 'Phone number or password is required.'
    });
  }

  try {
    const foundUser = await User.findOne({ phoneNumber }).exec();
    if (!foundUser) {
      return res.status(404).json({
        message: `User ${phoneNumber} not found.`
      });
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
      const { firstName, middleName, lastName } = foundUser;

      const accessToken = jwt.sign(
        {
          "UserInfo": { phoneNumber, firstName, middleName, lastName }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10s' }
      );

      const refreshToken = jwt.sign(
        {
          "UserInfo": { phoneNumber }
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '15s' }
      );
      foundUser.refreshToken = refreshToken;
      await foundUser.save();

      res.cookie('refreshToken', refreshToken, { 
        httpOnly: true, 
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 15 * 1000 
      });
      return res.json({ accessToken });

    } else {
      return res.status(401).json({
        message: 'Invalid password.'
      })
    }

  } catch (err) {
    return res.status(500).json({
      message: `Server Error: ${err.message}`
    })
  }
};

module.exports = { handleLogin };