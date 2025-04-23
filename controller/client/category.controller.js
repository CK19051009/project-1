const categoryModel = require("../../models/product.category");
const ProductModel = require("../../models/product.model");
const priceHelper = require("../../helpers/price.helper");
const breadCrumbHelper = require("../../helpers/breadcrumb.helper");
const subCategoryHelper = require("../../helpers/subcategory.helper");

// Hàm đệ quy lấy tất cả ID danh mục con
const getAllChildIds = async (parentId) => {
  const categories = await categoryModel
    .find({
      deleted: false,
      status: "active",
      parent_id: parentId,
    })
    .select("_id");

  let ids = [parentId];

  for (const category of categories) {
    const childIds = await getAllChildIds(category._id);
    ids = [...ids, ...childIds];
  }

  return ids;
};
module.exports.category = async (req, res) => {
  const slugCategory = req.params.slug;
  const categoryParent = await categoryModel.findOne({
    deleted: false,
    slug: slugCategory,
    status: "active",
  });

  const idParent = categoryParent.id;
  const ids = await getAllChildIds(categoryParent._id);
  if (ids.length === 0) {
    ids.push(idParent);
  }
  const breadCrumb = await breadCrumbHelper.breadCrumb(categoryParent);
  const products = await ProductModel.find({
    deleted: false,
    status: "active",
    parent_id: { $in: ids },
  }).select("-editBy -deletedBy -createdBy");

  const subCategorys = await subCategoryHelper.subCategory(categoryParent);
  const productsNew = priceHelper.priceList(products);
  res.render("./client/pages/category/index.pug", {
    pageTitle: categoryParent.title,
    products: productsNew,
    breadCrumb: breadCrumb,
    subCategorys: subCategorys,
  });
};
