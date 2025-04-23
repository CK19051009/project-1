const Role = require("../../models/roles.model");
const systemConfig = require("../../config/system.config");
// [GET] /admin/roles
module.exports.index = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("role_view")) {
    const roles = await Role.find({ deleted: false });
    res.render("./admin/pages/roles/index.pug", {
      pageTitle: "Nhóm quyền",
      roles: roles,
    });
  } else {
    res.status(400).send("loi");
    return;
  }
};

// [GET] /admin/roles/create

module.exports.getCreatePermissions = (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("role_create")) {
    res.render("./admin/pages/roles/create.pug", {
      pageTitle: "Thêm mới nhóm quyền",
    });
  } else {
    res.status(400).send("loi");
    return;
  }
};

// [POST] /admin/roles/create

module.exports.postCreatePermissions = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("role_create")) {
    try {
      const roleNew = new Role(req.body);
      await roleNew.save();
      req.flash("sucess", "Thêm mới quyền thành công!");
      res.redirect(`${systemConfig.pathglobal}/roles`);
    } catch (error) {
      req.flash("error", "Thêm mới quyền thất bại");
      res.redirect("back");
    }
  } else {
    res.status(400).send("loi");
    return;
  }
};

//[GET] /admin/roles/edit/:roleId

module.exports.getEditPermissions = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("role_edit")) {
    try {
      const roleId = req.params.roleId;
      const role = await Role.findOne({ _id: roleId, deleted: false });
      // console.log(role);
      res.render("./admin/pages/roles/edit.pug", {
        pageTitle: "Chỉnh sửa quyền ",
        role: role,
      });
    } catch (error) {
      res.redirect("back");
    }
  } else {
    res.status(400).send("loi");
    return;
  }
};

//[PATCH] /admin/roles/edit/:roleId

module.exports.patchEditPermissions = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("role_edit")) {
    try {
      // const {title , description} = req.body;
      await Role.updateOne({ _id: req.params.roleId }, req.body);

      res.redirect(`${systemConfig.pathglobal}/roles`);
    } catch (error) {}
  } else {
    res.status(400).send("loi");
    return;
  }
};

//[GET] /admin/roles/delete/:roleId
module.exports.deleteRole = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("role_delete")) {
    try {
      await Role.updateOne({ _id: req.params.roleId }, { deleted: true });
      req.flash("sucess", "Xóa thành công !");
      res.redirect("back");
    } catch (error) {
      res.status(403).send("ERROR");
    }
  } else {
    res.status(400).send("loi");
    return;
  }
};

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("role_edit")) {
    const roles = await Role.find({ deleted: false });

    res.render("./admin/pages/roles/permissions", {
      pageTitle: "Phân quyền",
      roles: roles,
    });
  } else {
    res.status(400).send("loi");
    return;
  }
};

// [PATCH] /admin/roles/permissions
module.exports.patchPermissions = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("role_edit")) {
    const permissions = JSON.parse(req.body.permissions); //note

    for (const item of permissions) {
      await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
    }
    req.flash("sucess", "Cập nhập quyền thành công!");
    res.redirect("back");
  } else {
    res.status(400).send("loi");
    return;
  }
};
