const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../db/userModel");
const path = require("path");
const { avatarFormater } = require("../helpers/avatarFormater");
const fs = require("fs").promises;

const registerUser = async (email, password) => {
  const user = new User({ email, password });
  const save = await user.save();
  return save;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    return;
  }
  const decodePassword = await bcrypt.compare(password, user.password);
  if (!decodePassword) {
    return;
  }
  const token = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_SECRET_KEY
  );
  const updateUser = await User.findByIdAndUpdate(user.id, {
    $set: { token },
  });
  if (!updateUser) {
    return;
  }
  return { user, token };
};

const logoutUser = async (_id) => {
  await User.findByIdAndUpdate(_id, {
    $set: { token: null },
  });
};

const updateSubscription = async (_id, subscription) => {
  const update = await User.findByIdAndUpdate(_id, {
    $set: { subscription },
  });
  return update;
};

const updateAvatar = async (req, filename) => {
  const { user } = req;
  const { _id: id } = user;
  const host = req.headers.host;

  const imgName = `${id}.jpg`;
  const FILE_DESTINATION = path.resolve(`./public/avatars/${imgName}`);
  if (user.avatarURL.includes(id)) {
    await fs.unlink(FILE_DESTINATION);
  }
  const FILE_READ = path.resolve(`./tmp/${filename}`);
  avatarFormater(FILE_READ, FILE_DESTINATION);
  const avatarURL = `${host}/avatars/${imgName}`;
  await User.findByIdAndUpdate(id, {
    $set: { avatarURL },
  });
  await fs.unlink(FILE_READ);
  return avatarURL;
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  updateSubscription,
  updateAvatar,
};
