const mongoose = require("mongoose");

const forgorschema = new mongoose.Schema(
  {
    email: String,
    otp: Number,
    expireAt: {
      type: Date,
      expires: 20, // 20 seconds
      default: Date.now,
    },
  },
  { timestamps: true }
);

const ForgotPassword = mongoose.model(
  "ForgotPassword",
  forgorschema,
  "forgot-password"
);

module.exports = ForgotPassword;
