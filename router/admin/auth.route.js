const express = require("express");

const routeAuth = express.Router();

const controller = require("../../controller/admin/auth.controller");

const validate = require("../../validate/admin/admin.validate"); //validate

// [GET] /admin/auth/login
routeAuth.get("/login", controller.getLogin);

// [POST] /admin/auth/login
routeAuth.post("/login", validate.login, controller.postLogin);

// [GET] /admin/auth/logout

routeAuth.get("/logout", controller.logout);

module.exports = routeAuth;
