module.exports.titleValidate = (req, res, next) => {
  if (!req.body.title) {
    req.flash("error", "Bạn chưa nhập tên quyền !");
    res.redirect("back");
    return;
  }
  next();
};

module.exports.createAccount = (req, res, next) => {
  if (!req.body.fullname) {
    req.flash("error", "Bạn chưa nhập tên  !");
    res.redirect("back");
    return;
  }
  if (!req.body.email) {
    req.flash("error", "Bạn chưa nhập email !");
    res.redirect("back");
    return;
  }
  if (!req.body.password) {
    req.flash("error", "Bạn chưa nhập mật khẩu !");
    res.redirect("back");
    return;
  }
  // if (!req.body.role_id) {
  //   req.flash("error", "Bạn chưa chọn quyền cho tài khoản !");
  //   res.redirect("back");
  //   return;
  // }
  next();
};

// /admin/auth/login

module.exports.login = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", "Chưa nhập email !");
    res.redirect("back");
    return;
  }
  if (!req.body.password) {
    req.flash("error", "Chưa nhập password !");
    res.redirect("back");
    return;
  }

  next();
};
