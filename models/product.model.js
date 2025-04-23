const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const productschema = new mongoose.Schema(
  {
    title: String,
    description: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    status: String,
    parent_id: {
      type: String,
      default: "",
    },
    price: Number,
    discountPersent: Number,
    position: Number,
    feature: String,
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    thumbnail: String,
    productImages: {
      type: Array,
      default: [],
    },
    createdBy: {
      account_id: String,
      fullName: String,
      createAt: Date,
    },
    editBy: [
      {
        account_id: String,
        fullName: String,
        editAt: Date,
      },
    ],

    deletedBy: {
      account_id: String,
      fullName: String,
      deletedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productschema, "products");

module.exports = Product;
