const express = require('express');
const { handleNewMessage, getMessages } = require('../controllers/messageController');
const router = express.Router();

router.route('/')
  .post(handleNewMessage);

router.route('/:chatId')
  .get(getMessages)

module.exports = router;