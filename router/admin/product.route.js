const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const cloudiary = require("../../middlewares/admin/cloud.mw");
const controller = require("../../controller/admin/product.controller");

// [GET] /admin/products
router.get("/", controller.index);

// [GET] /admin/products/create
router.get("/create", controller.getCreateProduct);

// [POST] /admin/products/create
router.post(
  "/create",
  // note--
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "productImages", maxCount: 10 },
  ]),
  cloudiary.cloudFileds,
  controller.postCreateProduct
);

// [GET] /admin/products/edit/:productId
router.get("/edit/:productId", controller.getEditProduct);

// [PATCH] /admin/products/edit/productId
router.patch(
  "/edit/:productId",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "productImages", maxCount: 10 },
  ]),
  cloudiary.cloudFileds,
  controller.patchEditProduct
);

// [GET] /admin/products/delete/:productId
router.get("/delete/:productId", controller.deleteProduct);

// [GET] /admin/products/change-status/:status/:productId
router.get("/change-status/:status/:productId", controller.changeStatus);

// [PATCH] /admin/products/change-multi
router.patch("/change-multi", controller.changeMultiProduct);

module.exports = router;
