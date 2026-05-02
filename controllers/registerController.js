const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
  const { phoneNumber, password, firstName, middleName, lastName } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({
      message: 'Phone number is required.'
    });
  } else if (!password) {
    return res.status(400).json({
      message: 'Password is required.'
    })
  } else if (!firstName) {
    return res.status(400).json({
      message: 'First name is required.'
    })
  } else if (!lastName) {
    return res.status(400).json({
      message: 'Last name is required.'
    })
  }

  try {
    const duplicate = await User.findOne({ phoneNumber }).exec();
    if (duplicate) {
      return res.status(409).json({
        message: `A user is already registered with phone number: ${phoneNumber}.`
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      phoneNumber, password: hashedPassword , firstName, middleName, lastName
    });

    res.status(201).json({ message: `New user created: ${phoneNumber}`});
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
};

module.exports = { handleNewUser };