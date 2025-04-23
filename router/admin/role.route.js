const express = require("express");
const roleRouter = express.Router();

const controller = require("../../controller/admin/role.controller");
const validate = require("../../validate/admin/admin.validate");
//[GET] /admin/roles
roleRouter.get("/", controller.index);

//[GET] /admin/roles/create
roleRouter.get("/create", controller.getCreatePermissions);

//[POST] /admin/roles/create
roleRouter.post(
  "/create",
  validate.titleValidate,
  controller.postCreatePermissions
);

//[GET] /admin/roles/edit/:roleId
roleRouter.get("/edit/:roleId", controller.getEditPermissions);

//[PATCH] /admin/roles/edit/:roleId
roleRouter.patch(
  "/edit/:roleId",
  validate.titleValidate,
  controller.patchEditPermissions
);

//[GET] /admin/roles/delete/:roleId

roleRouter.get("/delete/:roleId", controller.deleteRole);

// PERMISSIONS

// [GET] /admin/roles/permissions
roleRouter.get("/permissions", controller.permissions);

// [PATCH] /admin/roles/permissions
roleRouter.patch("/permissions", controller.patchPermissions);
//  END PERMISSIONS

module.exports = roleRouter;
