const CategoryModel = require("../models/product.category");

module.exports.breadCrumb = async (item) => {
  let array = [];

  if (item.parent_id === "") {
    array.push({
      title: "Trang chủ",
      href: `/`,
    });
    array.push({
      title: item.title,
      href: "#",
    });
    // console.log(array);
    return array;
  }
  let parent = await CategoryModel.findOne({ _id: item.parent_id });
  while (parent) {
    array.unshift({
      title: parent.title,
      href: `/category/${parent.slug}`,
    });
    const idParent = parent.parent_id;
    if (idParent === "") {
      array.push({
        title: item.title,
        href: "#",
      });
      break;
    }
    parent = await CategoryModel.findOne({
      _id: idParent,
      deleted: false,
      status: "active",
    });
  }
  array.unshift({
    title: "Trang chủ",
    href: `/`,
  });
  // console.log(array);
  return array;
};
