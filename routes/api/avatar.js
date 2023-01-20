const express = require("express");
const router = express.Router();
const path = require('path');

const FILE_DIR = path.resolve('./public/avatars')

router.use("/", express.static(FILE_DIR));


module.exports = router;