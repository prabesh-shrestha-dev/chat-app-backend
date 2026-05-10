const express = require('express');
const { getChatList, handleCreateChat } = require('../controllers/chatController');
const router = express.Router();

router.route('/')
  .get(getChatList)
  .post(handleCreateChat);

module.exports = router;