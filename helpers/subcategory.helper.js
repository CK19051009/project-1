const CategoryModel = require("../models/product.category");
module.exports.subCategory = async (item) => {
  let children = await CategoryModel.find({
    deleted: false,
    status: "active",
    parent_id: item.id,
  }).select("title slug thumbnail");
  return children;
};
