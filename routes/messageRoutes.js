const express = require("express");
const messageRouter = express.Router();
const { sendMessage } = require("../controllers/messageController");

messageRouter.post("/send-message", sendMessage);

module.exports = messageRouter;
