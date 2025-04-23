const Customer = require("../../models/client.model");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const priceHelper = require("../../helpers/price.helper");
const { breadCrumb } = require("../../helpers/breadcrumb.helper");
const unidecode = require("unidecode");
// [GET] /customer/profile
module.exports.index = (req, res) => {
  const client = res.locals.client;

  res.render("./client/pages/customer/index", {
    pageTitle: "Thông tin tài khoản",
    client: client,
    breadCrumb: [
      {
        title: "Trang chủ",
        href: "/",
      },
      {
        title: "Thông tin tài khoản",
        href: "#",
      },
    ],
  });
};
//[PATCH] /customer/profile
module.exports.update = async (req, res) => {
  const body = req.body;
  const client = res.locals.client;
  const id = client.id;
  const birthday = {
    day: body.day,
    month: body.month,
    year: body.year,
  };
  body.birthday = birthday;
  // console.log(body);
  await Customer.updateOne(
    { _id: id, status: "active", deleted: false },
    {
      ...body,
    }
  );
  res.redirect("back");
  // res.send("Cập nhật thành công");
};

//[GET] /customer/order?status&keyword=
module.exports.order = async (req, res) => {
  const { status = null, keyword = null } = req.query;
  const cart = res.locals.cart;
  const cartId = cart.id;
  const client = res.locals.client;
  const id = client.id;
  const find = {
    user_id: id,
    cart_id: cartId,
    deleted: false,
  };

  // console.log(keyword);
  if (keyword) {
    const searchOne = new RegExp(keyword, "i");
    const searchTwo = createSlug(keyword);
    find.$or = [
      {
        title: searchOne,
      },
      {
        slug: new RegExp(searchTwo, "i"),
      },
    ];
  }
  if (status) {
    find.status = status;
  }
  const orderOfYou = await Order.find(find);
  // console.log(orderOfYou);
  for (const order of orderOfYou) {
    for (const item of order.products) {
      const product = await Product.findOne({ _id: item.product_id }).select(
        "-description -deleted -createdAt -updatedAt -__v"
      );

      if (product) {
        item.thumbnail = product.thumbnail;
        item.title = product.title;
        item.totalPrice =
          priceHelper.priceItem(product).newPrice * item.quantity;
        item.totalAmount = item.totalPrice + 25000;
      }
    }
  }
  res.render("./client/pages/customer/orderOfMy", {
    pageTitle: "Đơn hàng của tôi",
    orders: orderOfYou,
    breadCrumb: [
      {
        title: "Trang chủ",
        href: "/",
      },
      {
        title: "Đơn hàng của tôi",
        href: "#",
      },
    ],
  });
};

//[PATCH] /customer/order/cancel/:id
module.exports.cancelOrder = async (req, res) => {
  const id = req.params.id;
  const cart = res.locals.cart;
  const cartId = cart.id;
  const client = res.locals.client;
  const userId = client.id;
  await Order.updateOne(
    { _id: id, user_id: userId, cart_id: cartId },
    {
      status: "cancelled",
    }
  );
  res.redirect("back");
};

function createSlug(keyword) {
  return unidecode(keyword)
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Loại bỏ ký tự đặc biệt
    .replace(/[\s]+/g, "-") // thay space bằng dấu cách
    .replace(/^-+|-+$/g, ""); // loại bỏ gạch đầu dòng;
}
