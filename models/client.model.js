const mongoose = require("mongoose");
const encryptionHelper = require("../helpers/encryption.helper");
const clientSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      default: "Kiet",
    },
    email: String,
    password: String,
    tokenClient: {
      type: String,
      default: encryptionHelper.encryptionToken(20),
    },
    birthday: {
      day: Number,
      month: Number,
      year: Number,
    },
    gender: String,
    phone: String,
    nickname: String,
    address: String,
    status: {
      type: String,
      default: "active",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    avatar: String,
    // role_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   default: null,
    // },
  },
  {
    timestamps: true,
  }
);

const Client = mongoose.model("Client", clientSchema, "clients");

module.exports = Client;
