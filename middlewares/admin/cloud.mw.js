const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});
let streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const uploadToCloudinary = async (buffer) => {
  let result = await streamUpload(buffer);
  return result.secure_url;
};
// upload single
module.exports.cloudImage = async (req, res, next) => {
  if (req.file) {
    req.body[req.file.fieldname] = await uploadToCloudinary(req.file.buffer);
  }
  next();
};

// end

// upload arrayImages

module.exports.cloudFileds = async (req, res, next) => {
  if (req.files) {
    for (const key in req.files) {
      req.body[key] = [];
      const array = req.files[key];
      for (const item of array) {
        try {
          const result = await uploadToCloudinary(item.buffer);
          req.body[key].push(result);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
  next();
};
