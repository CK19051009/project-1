const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user_id: String,
    cart_id: String,
    userInfo: {
      fullname: String,
      phone: String,
      address: String,
    },
    products: [
      {
        product_id: String,
        price: Number,
        discountPersent: Number,
        quantity: Number,
      },
    ],
    payMent: String,
    delivery: String,
    statusPayment: String, // "pending", "success", "failed"
    status: {
      enum: [
        "pending", // đang chờ xác nhận
        "comfirmed", // xác nhận đơn hàng
        "processing", //
        "shipped", // đang trong quá trình giao hàng
        "delivered", // giao thành công
        "cancelled", // hủy đơn hàng
      ],
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;
