const express = require("express");
const routerHome = express.Router();
const controller = require("../../controller/client/home.controller");
const cartController = require("../../controller/client/cart.controller");
//[GET] /
routerHome.get("/", controller.index);
// [GET] /search
routerHome.get("/search", controller.search);
routerHome.post("/api/v1/client/momo-callback", cartController.momoCallBack);
module.exports = routerHome;
