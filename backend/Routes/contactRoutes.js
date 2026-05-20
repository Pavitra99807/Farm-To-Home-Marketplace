const express =
require("express");

const router =
express.Router();

const {

  sendMessage,

  getMessages,

  getUserMessages,

  replyMessage,

} = require(
  "../controllers/contactController"
);

// SEND MESSAGE
router.post(
  "/send",
  sendMessage
);

// GET ALL MESSAGES
router.get(
  "/all",
  getMessages
);

// GET USER MESSAGES
router.get(
  "/user/:email",
  getUserMessages
);

// ADMIN REPLY
router.put(
  "/reply/:id",
  replyMessage
);

module.exports =
router;