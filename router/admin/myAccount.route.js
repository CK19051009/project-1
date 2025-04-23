const express = require("express");
const myAccountRouter = express.Router();
const controller = require("../../controller/admin/myaccount.controller");

myAccountRouter.get("/", controller.index);

module.exports = myAccountRouter;
