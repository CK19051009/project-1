const express = require("express");
const routerProduct = express.Router();
const controller = require("../../controller/client/product.controller");
// product/detail/:idProduct
routerProduct.get("/detail/:slug", controller.index);
module.exports = routerProduct;
