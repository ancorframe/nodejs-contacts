const multer = require("multer");
const path = require("path");
const FILE_DIR = path.resolve("./tmp");
// const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, FILE_DIR);
  },
  filename: (req, file, cb) => {
    const imgName=req.user._id
    const [, extention] = file.originalname.split(".");
    cb(null, `${imgName}.${extention}`);
  },
});

module.exports = {
  storage,
};
