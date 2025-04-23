const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/product.category.controller");
const multer = require("multer");
const upload = multer();
const clouddiary = require("../../middlewares/admin/cloud.mw");

//
router.get("/", controller.index);

// [GET] /admin/product-category/create
router.get("/create", controller.getCreateCategory);

// [POST] /admin/product-category/create
router.post(
  "/create",
  upload.single("thumbnail"),
  clouddiary.cloudImage,
  controller.postCreateCategory
);

//[GET] /admin/product-category/edit/:id
router.get("/edit/:id", controller.getEditCategory);

//[PATCH] /admin/product-category/edit/:id
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  clouddiary.cloudImage,
  controller.patchEditCategory
);

//[GET] /admin/product-category/delete/:id
router.get("/delete/:id", controller.getDeleteCategory);

//[GET] /admin/product-category/:status/:id
router.get("/change-status/:status/:id", controller.getStatus);

// [PATCH] /admin/product-category/change-multi
router.patch("/change-multi", controller.patchChangeMulti);
module.exports = router;
