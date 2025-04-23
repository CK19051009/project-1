const systemConfig = require("../../config/system.config");
const Account = require("../../models/accounts.model");
const Role = require("../../models/roles.model");
module.exports.authencation = async (req, res, next) => {
  if (!req.cookies.token) {
    res.redirect(`${systemConfig.pathglobal}/auth/login`);
    return;
  } else {
    const token = req.cookies.token;

    const user = await Account.findOne({ deleted: false, token: token }).select(
      "-password"
    );

    if (!user) {
      res.redirect(`${systemConfig.pathglobal}/auth/login`);
      return;
    }

    const role = await Role.findOne({ _id: user.role_id }).select(
      "title , permissions"
    );

    res.locals.user = user;
    res.locals.role = role;
    next();
  }
};
