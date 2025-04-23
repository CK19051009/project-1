const OrderModel = require("../../models/order.model");
const priceHelper = require("../../helpers/price.helper");
// [GET] /admin/orders
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };
  const orders = await OrderModel.find(find);
  for (const element of orders) {
    element.totalAmount = element.products.reduce((sum, item) => {
      return sum + priceHelper.priceItem(item).newPrice * item.quantity;
    }, 0);
    // console.log(orders[0].totalAmount);
  }
  res.render("./admin/pages/orders/index.pug", {
    pageTitle: "Quản lý đơn hàng",
    orders: orders,
  });
};

// [GET] /admin/order/change-status/:status/:orderId
module.exports.changeStatus = async (req, res) => {
  const { status, orderId } = req.params;
  await OrderModel.updateOne(
    { _id: orderId },
    {
      status: status,
    }
  );
  res.redirect("back");
};
