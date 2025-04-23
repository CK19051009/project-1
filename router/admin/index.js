const routeDashboard = require("./dashboard.route");
const routeAuth = require("./auth.route");
const routeAccount = require("./account.route");
const systemConfig = require("../../config/system.config");
const roleRouter = require("./role.route");
const myAccountRouter = require("./myAccount.route");
const auhenMiddleware = require("../../middlewares/admin/authen.middelware");
const productCategoryRouter = require("./product.category");
const productRouter = require("./product.route");
const routerOrder = require("./order.route");
module.exports = (app) => {
  const urlAdmin = systemConfig.pathglobal;
  app.use(
    urlAdmin + "/dashboard",
    auhenMiddleware.authencation,
    routeDashboard
  );
  app.use(urlAdmin + "/auth", routeAuth);
  app.use(urlAdmin + "/account", auhenMiddleware.authencation, routeAccount);
  app.use(urlAdmin + "/roles", auhenMiddleware.authencation, roleRouter);
  app.use(
    urlAdmin + "/myaccount",
    auhenMiddleware.authencation,
    myAccountRouter
  );
  app.use(
    urlAdmin + "/product-category",
    auhenMiddleware.authencation,
    productCategoryRouter
  );
  app.use(urlAdmin + "/orders", auhenMiddleware.authencation, routerOrder);
  app.use(urlAdmin + "/products", auhenMiddleware.authencation, productRouter);
};
