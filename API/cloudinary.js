const { config, uploader , search, api }  = require('cloudinary').v2,
      dotenv                = require('dotenv').config();

const cloudinaryConfig = (req, res, next) => {

config({
cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
api_key: process.env.CLOUDINARY_API_KEY,
api_secret: process.env.CLOUDINARY_API_SECRET,
});

next();

}

module.exports = { cloudinaryConfig, uploader , search, api};
