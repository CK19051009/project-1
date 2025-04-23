const express = require("express");

const routeDashboard = express.Router();
const controller = require("../../controller/admin/dashboard.controller");
routeDashboard.get("/", controller.index);

module.exports = routeDashboard;
