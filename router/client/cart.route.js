const express = require("express");
const routerCart = express.Router();
const controller = require("../../controller/client/cart.controller");

// [GET] /cart
routerCart.get("/", controller.index);

// [POST] /cart
// routerCart.post("/", controller.index);
// [POST] /cart/add/:productId
routerCart.post("/add/:productId", controller.addProduct);

//[GET] /cart/delete/:productId
routerCart.get("/delete/:productId", controller.deleteProduct);
//[POST] /cart/change/:productId
routerCart.post("/change/:productId", controller.changeProduct);

//[POST] /cart/checkout
routerCart.get("/checkout", controller.checkout);

//[POST] /cart/checkout
routerCart.post("/checkout", controller.checkout);

// [GET] /cart/checkout/shipping
// routerCart.get("/checkout/shipping", controller.getShipping);

// [POST] /cart/checkout/shipping
// routerCart.post("/checkout/shipping", controller.postShipping);

// [POST] /cart/checkout/order
routerCart.post("/checkout/order", controller.postOrder);

// [GET] /cart/checkout/order/success/:successId;
routerCart.get("/checkout/success/:successId", controller.orderSuccess);
module.exports = routerCart;
