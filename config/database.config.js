const mongoose = require("mongoose");
require("dotenv").config();
module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.URL_DATABASE);
    console.log("Connect Success");
  } catch (error) {
    console.log("Connect Error");
  }
};
