const createTreeHelper = require("../../helpers/create.tree.helper");
const ProductCategory = require("../../models/product.category");
const Product = require("../../models/product.model");
const systemConfig = require("../../config/system.config");
const buttonStatusHelper = require("../../helpers/button.status.helper");
const paginationHelper = require("../../helpers/pagination.helper");
// [GET] /admin/products
module.exports.index = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("product_view")) {
    const find = {
      deleted: false,
    };

    // button status
    if (req.query.status) {
      find.status = req.query.status;
    }
    const buttons = buttonStatusHelper.buttonStatus(req.query);
    // end button status

    // search
    if (req.query.keyword) {
      const keyword = new RegExp(req.query.keyword, "i");
      find.title = keyword;
    }
    // end search

    // sort
    const sort = {};
    if (req.query.sortkey && req.query.sortvalue) {
      sort[req.query.sortkey] = req.query.sortvalue;
    } else {
      sort.position = "asc";
    }
    // end sort

    // pagination
    const objectpagination = {
      limit: 4,
      currentPage: 1,
    };
    const countProducts = await Product.countDocuments();

    const pagination = paginationHelper.pagination(
      objectpagination,
      req.query,
      countProducts
    );
    // end pagination

    const allProduct = await Product.find(find)
      .limit(pagination.limit)
      .skip(pagination.skip)
      .sort(sort);
    res.render("./admin/pages/product/index", {
      pageTitle: "Sản phẩm",
      products: allProduct,
      buttonStatus: buttons,
      keyword: req.query.keyword,
      pagination: pagination,
    });
  } else {
    res.status(400).send("loi");
    return;
  }
};

// [GET] /admin/products/create
module.exports.getCreateProduct = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("product_create")) {
    const categorys = await ProductCategory.find({ deleted: false });
    const newCategorys = createTreeHelper.createTree(categorys);
    res.render("./admin/pages/product/create", {
      pageTitle: "Tạo Sản phẩm Mới",
      newCategorys: newCategorys,
    });
  } else {
    res.status(400).send("loi");
    return;
  }
};

// [POST] /admin/products/create
module.exports.postCreateProduct = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("product_create")) {
    const allProduct = await Product.countDocuments();
    if (req.body.position === "") {
      req.body.position = allProduct + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }
    if (req.body.thumbnail) {
      req.body.thumbnail = req.body.thumbnail[0];
    }

    req.body.price = parseInt(req.body.price);
    if (req.body.discountPersent !== "") {
      req.body.discountPersent = parseInt(req.body.discountPersent);
    } else {
      req.body.discountPersent = 0;
    }
    const createdBy = {
      account_id: res.locals.user.id,
      fullName: res.locals.user.fullname,
      createdAt: Date.now(),
    };
    const newProduct = new Product({ ...req.body, createdBy: createdBy });

    await newProduct.save();
    req.flash("sucess", "Tạo sản phẩm thành công !");
    res.redirect(`${systemConfig.pathglobal}/products`);
  } else {
    res.status(400).send("loi");
    return;
  }
};

// [GET] /admin/products/edit/productId
module.exports.getEditProduct = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("product_edit")) {
    try {
      const product = await Product.findOne({
        deleted: false,
        _id: req.params.productId,
      });
      const categorys = await ProductCategory.find({
        deleted: false,
      });
      const newCategorys = createTreeHelper.createTree(categorys);
      // console.log(categoryParent);
      res.render("./admin/pages/product/edit", {
        pageTitle: "Chỉnh sửa sản phẩm ",
        product: product,
        newCategorys: newCategorys,
      });
    } catch (error) {
      res.status(400).send("loi");
    }
  } else {
    res.status(400).send("loi");
    return;
  }
};

// [PATCH] /admin/products/edit/productId
module.exports.patchEditProduct = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("product_edit")) {
    try {
      req.body.position = parseInt(req.body.position);
      req.body.price = parseInt(req.body.price);
      req.body.discountPersent = parseInt(req.body.discountPersent);
      const id = req.params.productId;
      const editBy = {
        account_id: res.locals.user.id,
        fullName: res.locals.user.fullname,
        editAt: Date.now(),
      };
      await Product.updateOne(
        { _id: id },
        {
          ...req.body,
          $push: { editBy: editBy },
        }
      );

      req.flash("sucess", "Chỉnh sửa sản phẩm thành công!");
      res.redirect(`${systemConfig.pathglobal}/products`);
    } catch (error) {
      console.log(error);
      req.flash("error", "Chỉnh sửa sản phẩm không thành công!");
      res.redirect("back");
    }
  } else {
    res.status(400).send("loi");
    return;
  }
};

// [GET] /admin/products/delete/:productId

module.exports.deleteProduct = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("product_delete")) {
    try {
      const id = req.params.productId;
      const userDeleted = {
        account_id: res.locals.user.id,
        fullName: res.locals.user.fullname,
        deletedAt: Date.now(),
      };
      await Product.updateOne(
        { _id: id },
        { deleted: true, deletedBy: userDeleted }
      );

      req.flash("sucess", "Xóa sản phẩm thành công!");
      res.redirect("back");
    } catch (error) {
      req.flash("error", "Xóa sản phẩm không thành công!");
      res.redirect("back");
    }
  } else {
    res.status(400).send("loi");
    return;
  }
};

// [GET] /admin/products/change-status/:status/:productId
module.exports.changeStatus = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("product_edit")) {
    try {
      const id = req.params.productId;
      const status = req.params.status;
      const editBy = {
        account_id: res.locals.user.id,
        fullName: res.locals.user.fullname,
        editAt: Date.now(),
      };
      await Product.updateOne({ _id: id }, { status: status, editBy: editBy });
      req.flash(
        "sucess",
        "Bạn chuyển đổi trạng thái " + status + " thành công!"
      );
      res.redirect("back");
    } catch (error) {
      const status = req.params.status;
      req.flash(
        "error",
        "Bạn chuyển đổi trạng thái " + status + " không thành công!"
      );
      res.redirect("back");
    }
  } else {
    res.status(400).send("loi");
    return;
  }
};

// [PATCH] /admin/products/change-multi
module.exports.changeMultiProduct = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("product_edit")) {
    const action = req.body.action;
    const ids = req.body.ids.split(", ");
    // console.log(ids);
    const editBy = {
      account_id: res.locals.user.id,
      fullName: res.locals.user.fullname,
      editAt: Date.now(),
    };
    const userDeleted = {
      account_id: res.locals.user.id,
      fullName: res.locals.user.fullname,
      deletedAt: Date.now(),
    };
    switch (action) {
      case "actives":
        await Product.updateMany(
          { _id: { $in: ids } },
          { status: "active", $push: { editBy: editBy } }
        );
        req.flash("sucess", "Chuyển trạng thái thành công !");
        res.redirect("back");
        break;
      case "inactives":
        await Product.updateMany(
          { _id: { $in: ids } },
          { status: "inactive", $push: { editBy: editBy } }
        );
        req.flash("sucess", "Chuyển trạng thái thành công !");
        res.redirect("back");
        break;
      case "deletes":
        await Product.updateMany(
          { _id: { $in: ids } },
          { deleted: true, deletedBy: userDeleted }
        );
        req.flash("sucess", `Xóa ${ids.length} sản phẩm thành công !`);
        res.redirect("back");
        break;
      case "positions":
        // console.log(ids);
        for (const item of ids) {
          const [id, position] = item.split("-");
          await Product.updateOne(
            { _id: id },
            { position: position, $push: { editBy: editBy } }
          );
        }

        req.flash("sucess", `Đổi vị trí thành công !`);
        res.redirect("back");
        break;
      default:
        break;
    }
  } else {
    res.status(400).send("loi");
    return;
  }
};
