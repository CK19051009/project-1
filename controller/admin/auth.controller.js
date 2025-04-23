const Account = require("../../models/accounts.model");
const systemConfig = require("../../config/system.config");
const md5 = require("md5");
// [GET] /admin/auth/login

module.exports.getLogin = (req, res) => {
  if (req.cookies.token) {
    res.redirect(`${systemConfig.pathglobal}/dashboard`);
    return;
  } else {
    res.render("./admin/pages/auths/login.pug", {
      pageTitle: "Đăng nhập tài khoản",
    });
  }
};

// [POST] /admin/auth/login

module.exports.postLogin = async (req, res) => {
  let { email, password } = req.body;
  const exitEmail = await Account.findOne({ deleted: false, email: email });
  if (!exitEmail) {
    req.flash("error", "Email không đúng !");
    res.redirect("back");
    return;
  }
  password = md5(password);
  if (password !== exitEmail.password) {
    req.flash("error", "Sai mật khẩu !");
    res.redirect("back");
    return;
  }
  if (exitEmail.status === "inactive") {
    req.flash("error", "Tài khoản đã bị khóa !");
    res.redirect("back");
    return;
  }

  res.cookie("token", exitEmail.token);
  res.redirect(`${systemConfig.pathglobal}/dashboard`);
};

// [GET] /admin/auth/logout

module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect(`${systemConfig.pathglobal}/auth/login`);
};
