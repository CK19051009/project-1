const express = require("express");
const routerAccount = express.Router();

const controller = require("../../controller/client/account.controller");
// [GET] /customer/profile/
routerAccount.get("/profile", controller.index);
// [PATCH] /customer/profile/
routerAccount.patch("/profile", controller.update);
//[GET] /customer/order
routerAccount.get("/order", controller.order);
//[PATCH] /customer/order/cancel/:id
routerAccount.get("/order/cancel/:id", controller.cancelOrder);
module.exports = routerAccount;
