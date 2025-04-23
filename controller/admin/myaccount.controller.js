module.exports.index = (req, res) => {
  const user = res.locals.user;
  if (user) {
    res.render("./admin/pages/myaccount/index", {
      pageTitle: "Thông tin cá nhân",
    });
  } else {
    res.status(400).send("loi");
  }
};
