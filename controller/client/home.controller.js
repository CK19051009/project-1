// const ProductCategory = require("../../models/product.category");
const unidecode = require("unidecode");
const Product = require("../../models/product.model");
const priceHelper = require("../../helpers/price.helper");
module.exports.index = async (req, res) => {
  const productFeature = await Product.find({
    deleted: false,
    feature: "1",
    status: "active",
  }).select("-description -editBy");
  const newProductFeature = priceHelper.priceList(productFeature);

  const productNew = await Product.find({
    deleted: false,
    status: "active",
  }).sort({ position: "desc" });

  const productNewPrice = priceHelper.priceList(productNew);
  res.render("./client/pages/home/index.pug", {
    pageTitle: "Trang chủ",
    newProductFeature: newProductFeature,
    productNew: productNewPrice,
    currentPath: req.path,
  });
};

// [GET] /search
function createSlug(keyword) {
  return unidecode(keyword)
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Loại bỏ ký tự đặc biệt
    .replace(/[\s]+/g, "-") // thay space bằng dấu cách
    .replace(/^-+|-+$/g, ""); // loại bỏ gạch đầu dòng;
}
module.exports.search = async (req, res) => {
  const { keyword = null, page = 1 } = req.query;
  const slugSearch = createSlug(keyword);
  const name = new RegExp(keyword, "i");

  const find = {
    $or: [
      {
        title: name,
      },
      {
        slug: slugSearch,
      },
    ],
    deleted: false,
    status: "active",
  };

  const products = await Product.find(find).select(
    "-description -createdBy -editBy -deleteBy"
  );
  const newProductFeature = priceHelper.priceList(products);
  res.render("./client/pages/search/index", {
    pageTitle: "Tìm kiếm sản phẩm",
    breadCrumb: [
      {
        title: "Trang chủ",
        href: "/",
      },
      {
        title: "Tìm kiếm sản phẩm",
        href: "#",
      },
    ],
    products: newProductFeature,
    keyword: keyword,
  });
};
