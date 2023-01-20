const multer = require("multer");
const { storage } = require("../helpers/storageConfiguration");

const uploadMiddleware = multer({ storage });

module.exports = {
  uploadMiddleware,
};
