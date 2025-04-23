const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const productCategoryschema = new mongoose.Schema(
  {
    title: String,
    description: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "inactive"],
    },
    parent_id: {
      type: String,
      default: "",
    },
    position: Number,
    feature: String,
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    thumbnail: String,
    createdBy: {
      account_id: String,
      fullName: String,
      createdAt: Date,
    },
    deletedBy: {
      account_id: String,
      fullName: String,
      deletedAt: Date,
    },
    editBY: [
      {
        account_id: String,
        fullName: String,
        editAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ProductCategory = mongoose.model(
  "ProductCategory",
  productCategoryschema,
  "product-categorys"
);

module.exports = ProductCategory;
