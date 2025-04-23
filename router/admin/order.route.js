const express = require("express");

const routerOrder = express.Router();

const controller = require("../../controller/admin/order.controller");

// [GET] /admin/orders
routerOrder.get("/", controller.index);

// [get] /admin/order/change-status/:status/:orderId
routerOrder.get("/change-status/:status/:orderId", controller.changeStatus);

module.exports = routerOrder;
