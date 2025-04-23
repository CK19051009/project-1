const express = require("express");
const routerChat = express.Router();
const controller = require("../../controller/client/chat.controller");

routerChat.get("/", controller.index);

module.exports = routerChat;
