const { BadRequest } = require("../helpers/errors");
const Jimp = require("jimp");

const avatarFormater = (FILE_READ,FILE_DESTINATION)=>{
  Jimp.read(FILE_READ, (err, img) => {
    if (err) {
      throw new BadRequest(err);
    }
    img.resize(250, 250).write(FILE_DESTINATION);
  });
}

module.exports={
    avatarFormater
}