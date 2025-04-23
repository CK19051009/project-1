const mongoose = require("mongoose");
const encryptionHelper = require("../helpers/encryption.helper");
const accountSchema = new mongoose.Schema(
  {
    fullname: String,
    email: String,
    password: String,
    token: {
      type: String,
      default: encryptionHelper.encryptionToken(20),
    },
    address: String,
    status: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    avatar: String,
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model("Account", accountSchema, "accounts");

module.exports = Account;
