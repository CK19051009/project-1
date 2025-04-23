const Roles = require("../../models/roles.model");
const md5 = require("md5");
const Account = require("../../models/accounts.model");
const systemConfig = require("../../config/system.config");
// [GET] /admin/account

module.exports.index = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("account_view")) {
    const accounts = await Account.find({ deleted: false }); //get account
    const roles = await Roles.find({ deleted: false }); // get roles
    res.render("./admin/pages/accounts/index", {
      pageTitle: "Quản lý tài khoản",
      accounts: accounts,
      roles: roles,
    });
  } else {
    res.status(400).send("loi");
    return;
  }
};

// [GET] /admin/account/create

module.exports.getCreateAccount = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("account_create")) {
    const roles = await Roles.find({ deleted: false }); // Get Role

    res.render("./admin/pages/accounts/create.pug", {
      pageTitle: "Thêm mới tài khoản",
      roles: roles,
    });
  } else {
    res.status(400).send("loi");
    return;
  }
};

// [POST] /admin/account/create

module.exports.postCreateAccount = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("account_create")) {
    const email = req.body.email;
    const exitEmail = await Account.findOne({ deleted: false, email: email });
    if (exitEmail) {
      req.flash("error", "Email đã tồn tại!");
      res.redirect("back");
      return;
    }

    req.body.password = md5(req.body.password);
    const account = new Account(req.body);
    await account.save();
    req.flash("sucess", "Tạo tài khoản thành công!");
    res.redirect(`${systemConfig.pathglobal}/account`);
  } else {
    res.status(400).send("loi");
    return;
  }
};

// [GET] /admin/account/delete/:accountId

module.exports.getDeleteAccount = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("account_delete")) {
    try {
      const id = req.params.accountId;
      await Account.updateOne({ _id: id }, { deleted: true });
      req.flash("sucess", "Xóa tài khoản thành công !");
      res.redirect("back");
    } catch (error) {
      res.status(403).send("loi");
      return;
    }
  } else {
    res.status(400).send("loi");
    return;
  }
};

// [GET] /admin/account/edit/:accountId
module.exports.getEditAccount = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("account_edit")) {
    const id = req.params.accountId;
    const roles = await Roles.find({ deleted: false }); // get roles
    const account = await Account.findOne({ deleted: false, _id: id });

    res.render("./admin/pages/accounts/edit.pug", {
      pageTitle: "Chỉnh sửa tài khoản",
      account: account,
      roles: roles,
    });
  } else {
    res.status(400).send("loi");
    return;
  }
};

// [PATCH] /admin/account/edit/:accountId

module.exports.patchEditAccount = async (req, res) => {
  const user = res.locals.user;
  const permissions = res.locals.role.permissions;
  if (user && permissions.includes("account_edit")) {
    const id = req.params.accountId;
    const EmailDateBase = await Account.find({
      _id: { $ne: id },
      deleted: false,
    });
    // console.log(EmailDateBase);
    const exitEmail = EmailDateBase.find(
      (item) => item.email === req.body.email
    );
    // console.log(exitEmail);
    // console.log(exitEmail);
    if (exitEmail) {
      req.flash("error", "Email đã tồn tại!");
      res.redirect("back");
      return;
    }
    if (req.body.password !== "") {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
    console.log(req.body);
    await Account.updateOne({ _id: id }, req.body);
    req.flash("sucess", "Chỉnh sửa tài khoản thành công!");
    res.redirect(`${systemConfig.pathglobal}/account`);
  } else {
    res.status(400).send("loi");
    return;
  }
};
