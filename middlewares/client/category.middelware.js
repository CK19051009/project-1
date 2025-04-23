const productCategory = require("../../models/product.category");
const categoryHelper = require("../../helpers/create.tree.helper");
const ClientModel = require("../../models/client.model");
module.exports.category = async (req, res, next) => {
  const categoryProducts = await productCategory.find({ deleted: false });

  const categoryNews = categoryHelper.createTree(categoryProducts);

  res.locals.category = categoryNews;

  next();
};
