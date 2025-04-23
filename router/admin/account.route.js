const express = require("express");
const multer = require("multer");
const upload = multer();
const clouddiary = require("../../middlewares/admin/cloud.mw");
const validate = require("../../validate/admin/admin.validate");
const routeAccount = express.Router();

const controller = require("../../controller/admin/account.controller");

// [GET] /admin/account
routeAccount.get("/", controller.index);

// [GET] /admin/account/create

routeAccount.get("/create", controller.getCreateAccount);

// [POST] /admin/account/create

routeAccount.post(
  "/create",
  upload.single("avatar"),
  clouddiary.cloudImage,
  validate.createAccount,
  controller.postCreateAccount
);

// [GET] /admin/account/delete/:accountId
routeAccount.get("/delete/:accountId", controller.getDeleteAccount);

// [GET] /admin/account/edit/:accountId
routeAccount.get("/edit/:accountId", controller.getEditAccount);

// [PATCH] /admin/account/edit/:accountId
routeAccount.patch(
  "/edit/:accountId",
  upload.single("avatar"),
  clouddiary.cloudImage,
  controller.patchEditAccount
);
module.exports = routeAccount;
