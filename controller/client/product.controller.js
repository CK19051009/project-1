const Product = require("../../models/product.model");
const productHelper = require("../../helpers/price.helper");
const breadCrumbHelper = require("../../helpers/breadcrumb.helper");
module.exports.index = async (req, res) => {
  const slug = req.params.slug;
  const product = await Product.findOne({
    deleted: false,
    slug: slug,
  }).select("-editBy -deletedBy");
  const newProduct = productHelper.priceItem(product);
  const breadCrumb = await breadCrumbHelper.breadCrumb(product);
  res.render("./client/pages/product/index.pug", {
    pageTitle: "Chi tiết sản phẩm ",
    product: newProduct,
    breadCrumb: breadCrumb,
  });
};
