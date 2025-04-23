const mongoose = require("mongoose");
const shippingSchema = new mongoose.Schema(
  {
    userId: String,
    fullName: String,
    phone: String,
    address: String,
    addressType: String,
    status: String,
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Shipping = mongoose.model("Shipping", shippingSchema, "shippings");
module.exports = Shipping;
