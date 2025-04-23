const ProductCategory = require("../../models/product.category");
const systemConfig = require("../../config/system.config");
const createTreeHelper = require("../../helpers/create.tree.helper");
const buttonStatusHelper = require("../../helpers/button.status.helper");

//[GET] /admin/product-category
module.exports.index = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("product-category_view")) {
    const find = {
      deleted: false,
    };
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
    //end sort

    // button status

    if (req.query.status) {
      find.status = req.query.status;
    }
    const objectButtons = buttonStatusHelper.buttonStatus(req.query);

    // end button status

    // ??
    // pagination
    // const objectPagination = {
    //   limit: 5,
    //   currentPage: 1,
    // };
    // let skip = 0;
    // const allPages = Math.ceil(
    //   (await ProductCategory.countDocuments()) / objectPagination.limit
    // );
    // console.log(allPages);
    // if (req.query.page) {
    //   objectPagination.currentPage = req.query.page;
    //   skip = (objectPagination.currentPage - 1) * objectPagination.limit;
    // }

    //
    // end pagination

    const categorys = await ProductCategory.find(find).sort(sort);
    const newCategorys = createTreeHelper.createTree(categorys);

    res.render("./admin/pages/product.category/index", {
      pageTitle: "Danh mục sản phẩm ",
      newCategorys: newCategorys,
      keyword: req.query.keyword,
      buttonStatus: objectButtons,
    });
  } else {
    res.status(400).send("loi");
    return;
  }
};

// [GET] /admin/product-category/create
module.exports.getCreateCategory = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("product-category_create")) {
    const categorys = await ProductCategory.find({ deleted: false });

    const newCategorys = createTreeHelper.createTree(categorys);
    res.render("./admin/pages/product.category/create", {
      pageTitle: "Tạo mới danh mục",
      newCategorys: newCategorys,
    });
  } else {
    res.status(400).send("loi");
    return;
  }
};

// [POST] /admin/product-category/create
module.exports.postCreateCategory = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("product-category_create")) {
    const allCategory = await ProductCategory.countDocuments();

    if (req.body.position !== "") {
      req.body.position = parseInt(req.body.position);
    } else {
      req.body.position = allCategory + 1;
    }

    const userCreated = {
      account_id: res.locals.user.id,
      fullName: res.locals.user.fullname,
      createdAt: Date.now(),
    };

    const category = new ProductCategory({
      ...req.body,
      createdBy: userCreated,
    });
    await category.save();
    req.flash("sucess", "Tạo mới danh mục thành công!");
    res.redirect(`${systemConfig.pathglobal}/product-category`);
  } else {
    res.status(400).send("loi");
    return;
  }
};

//[GET] /admin/product-category/edit/:id
module.exports.getEditCategory = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("product-category_edit")) {
    const id = req.params.id;
    const categoryProduct = await ProductCategory.findOne({
      deleted: false,
      _id: id,
    });

    const categorys = await ProductCategory.find({ deleted: false });
    const newCategorys = createTreeHelper.createTree(categorys);
    res.render("./admin/pages/product.category/edit", {
      pageTitle: "Chỉnh sửa danh mục",
      categoryProduct: categoryProduct,
      newCategorys: newCategorys,
    });
  } else {
    res.status(400).send("loi");
    return;
  }
};

//[PATCH] /admin/product-category/edit/:id

module.exports.patchEditCategory = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("product-category_edit")) {
    req.body.position = parseInt(req.body.position);
    const userEdit = {
      account_id: res.locals.user.id,
      fullName: res.locals.user.fullname,
      editAt: Date.now(),
    };
    await ProductCategory.updateOne(
      { _id: req.params.id },
      { ...req.body, $push: { editBY: userEdit } }
    );
    req.flash("sucess", "Chỉnh sửa thành công !");
    res.redirect(`${systemConfig.pathglobal}/product-category`);
  } else {
    res.status(400).send("Ban khong co quyen truy cap");
    return;
  }
};

//[GET] /admin/product-category/delete/:id
module.exports.getDeleteCategory = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("product-category_edit")) {
    const id = req.params.id;
    // console.log(id);
    const userDeleted = {
      account_id: res.locals.user.id,
      fullName: res.locals.user.fullname,
      deletedAt: Date.now(),
    };
    await ProductCategory.updateOne(
      { _id: id },
      { deleted: true, deletedBy: userDeleted }
    );
    req.flash("sucess", "Xóa danh mục thành công !");
    res.redirect("back");
  } else {
    res.status(400).send("loi");
    return;
  }
};

//[GET] /admin/product-category/change-status/:status/:id

module.exports.getStatus = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("product-category_edit")) {
    try {
      const status = req.params.status;
      const id = req.params.id;
      const userEdit = {
        account_id: res.locals.user.id,
        fullName: res.locals.user.fullname,
        editAt: Date.now(),
      };
      await ProductCategory.updateOne(
        { _id: id },
        { status: status, editBY: userEdit }
      );
      req.flash("sucess", "Cập nhập trạng thái thành công!");
      res.redirect("back");
    } catch (error) {
      res.status(400).send("loi");
    }
  } else {
    res.status(400).send("loi");
    return;
  }
};

// [PATCH] /admin/product-category/change-multi
module.exports.patchChangeMulti = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("product-category_edit")) {
    const action = req.body.action;
    const ids = req.body.ids.split(", ");
    const userEdit = {
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
      //
      case "actives":
        await ProductCategory.updateMany(
          { _id: { $in: ids } },
          {
            status: "active",
            $push: { editBY: userEdit },
          }
        );

        req.flash("sucess", "Cập nhập trạng thái thành công !");
        res.redirect("back");

        break;
      //
      case "inactives":
        await ProductCategory.updateMany(
          { _id: { $in: ids } },
          {
            status: "inactive",
            $push: { editBY: userEdit },
          }
        );
        req.flash("sucess", "Cập nhập trạng thái thành công !");
        res.redirect("back");
        break;
      //
      case "deletes":
        await ProductCategory.updateMany(
          { _id: { $in: ids } },
          {
            deleted: true,
            deletedBy: userDeleted,
          }
        );

        req.flash("sucess", `Xóa ${ids.length} danh mục thành công !`);
        res.redirect("back");
        break;

      case "positions":
        for (const item of ids) {
          const [id, position] = item.split("-");
          await ProductCategory.updateOne(
            { _id: id },
            { position: position, $push: { editBY: userEdit } }
          );
        }

        req.flash(
          "sucess",
          `Thay đổi vị trí cho ${ids.length} danh mục thành công !`
        );
        res.redirect("back");

        break;
    }
  } else {
    res.status(400).send("loi");
    return;
  }
};
