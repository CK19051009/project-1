const express = require("express");
const routerCategory = express.Router();
const controller = require("../../controller/client/category.controller");
routerCategory.get("/:slug", controller.category);
module.exports = routerCategory;
