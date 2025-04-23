const express = require("express");
const routeAuth = express.Router();

const controller = require("../../controller/client/auth.controller");
const authuMiddlewares = require("../../middlewares/client/auth.middlewares");
// [GET] /auth/login
routeAuth.get("/login", controller.getLogin);

// [POST] /auth/login
routeAuth.post("/login", controller.postLogin);
// [GET] /auth/register
routeAuth.get("/register", controller.getRegister);
// [POST] /auth/register
routeAuth.post("/register", controller.postRegister);
// [GET] /auth/logout
routeAuth.get("/logout", controller.logout);

//[GET] /auth/password/forgot
routeAuth.get("/password/forgot", controller.getForgot);
//[POST] /auth/password/forgot
routeAuth.post("/password/forgot", controller.postForgot);
// [GET] /auth/password/otp
routeAuth.get("/password/otp", controller.getOtp);
// [POST] /user/password/otp
routeAuth.post("/password/otp", controller.postOtp);

// [GET] /auth/password/rest
routeAuth.get(
  "/password/rest",
  authuMiddlewares.authMiddleware,
  controller.getRest
);
// [POST] /auth/password/rest
routeAuth.post(
  "/password/rest",
  authuMiddlewares.authMiddleware,
  controller.postRest
);

module.exports = routeAuth;
