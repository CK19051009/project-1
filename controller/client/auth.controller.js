const md5 = require("md5");
const Client = require("../../models/client.model");
const randomOtp = require("../../helpers/create.otp.helper");
const { sendMail } = require("../../helpers/send.mail.helper");
const ForgotPassword = require("../../models/password-forgot.model");
//[GET] /auth/login
module.exports.getLogin = (req, res) => {
  res.render("./client/pages/auth/login.pug");
};

//[POST] /auth/login
module.exports.postLogin = async (req, res) => {
  const email = req.body.email;
  let password = req.body.password;
  console.log(email);

  password = md5(password);
  // console.log(password);
  const clientDb = await Client.findOne({
    deleted: false,
    email: email,
    status: "active",
  });
  // console.log(clientDb.password);
  if (!clientDb) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
  } else if (password !== clientDb.password) {
    req.flash("error", "Bạn nhập sai mật khẩu!");
    res.redirect("back");
  } else {
    res.cookie("token_user", clientDb.tokenClient);
    res.redirect("/");
  }
};
// [GET] /auth/register
module.exports.getRegister = (req, res) => {
  if (req.cookies.token_user) {
    res.redirect("/");
  } else {
    res.render("./client/pages/auth/register.pug");
  }
};

// [POST] /auth/register
module.exports.postRegister = async (req, res) => {
  const email = req.body.email;
  let password = req.body.password;
  const passwordConfirm = req.body.confirmpassword;
  const checkEmail = await Client.findOne({ email: email, deleted: false });
  if (checkEmail) {
    req.flash("error", "Email đã tồn tài!");
    res.redirect("back");
    return;
  }
  if (password !== passwordConfirm) {
    req.flash("error", "Mật khẩu không khớp");
    res.redirect("back");
    return;
  }
  // password = md5(password);
  const client = new Client({
    ...req.body,
    password: (password = md5(password)),
  });

  await client.save();
  res.cookie("token_user", client.tokenClient);
  res.redirect("/");
};

// [GET] /auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie("token_user");
  res.clearCookie("cart_id");
  res.redirect("/");
};

//[GET] /auth/password/forgot
module.exports.getForgot = (req, res) => {
  res.render("./client/pages/auth/password.forgot.pug", {
    pagetitle: "Quên mật khẩu ",
  });
};

//[POST] /auth/password/forgot
module.exports.postForgot = async (req, res) => {
  const email = req.body.email;

  const userAuthen = await Client.findOne({
    email: email,
    status: "active",
    deleted: false,
  });
  if (!userAuthen) {
    console.log("Email khong ton tai!");
    res.redirect("back");
    return;
  }

  res.redirect(`/auth/password/otp?email=${email}`);
};

// [GET] /auth/password/otp
module.exports.getOtp = async (req, res) => {
  const email = req.query.email;
  const data = {
    email: email,
    otp: randomOtp.ramdomOtp(6),
  };
  const otpAuthen = new ForgotPassword(data);
  await otpAuthen.save();

  const otp = otpAuthen.otp;
  sendMail(email, otp);
  res.render("./client/pages/auth/password.otp.pug", {
    pageTitle: "Xác thực OTP",
    email: email,
  });
};
// [POST] /user/password/otp
module.exports.postOtp = async (req, res) => {
  const { email, otp } = req.body;
  const otpAuthen = await ForgotPassword.findOne({ email: email, otp: otp });
  if (!otpAuthen) {
    console.log("Nhap khong dung OTP!");
    res.redirect("back");
    return;
  }
  const user = await Client.findOne({ email: email });

  res.cookie("token_user", user.tokenClient);

  res.redirect("/auth/password/rest");
};

// [GET] /user/password/rest
module.exports.getRest = async (req, res) => {
  if (!req.cookies.token_user) {
    console.log("ban khong co quyen truy cap");
    res.redirect("/");
    return;
  } else {
    res.render("./client/pages/auth/password.rest.pug", {
      pageTitle: "Đổi mật khẩu",
    });
  }
};
// [POST] /auth/password/rest
module.exports.postRest = async (req, res) => {
  const password = req.body.password;
  const confirmpassword = req.body.confirmpassword;

  if (password !== confirmpassword) {
    console.log("Xac thuc mat khau khong dung!");
    res.redirect("back");
    return;
  }
  const tokenUser = req.cookies.token_user;

  const user = await Client.findOne({ tokenClient: tokenUser });
  if (!user) {
    console.log("user khong ton tai");
    res.redirect("/auth/login");
    return;
  }
  await Client.updateOne(
    { tokenClient: tokenUser },
    { password: md5(password) }
  );

  res.redirect("/");
};
