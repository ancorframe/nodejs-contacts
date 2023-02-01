const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../db/userModel");
const path = require("path");
const { avatarFormater } = require("../helpers/avatarFormater");
const { verification, restorePassword } = require("../helpers/emailSender");
const fs = require("fs").promises;
const sha256 = require("sha256");
const { v4: uuidv4 } = require("uuid");

const UI_URL = process.env.UI_URL;
const SERVER_URL = process.env.SERVER_URL;

const registerUser = async (email, password) => {
  const secret = process.env.JWT_SECRET_KEY;
  const verificationToken = sha256.x2(email + secret);
  const user = new User({ email, password, verificationToken });
  await user.save();
  const send = await verification({
    to: email,
    link: `${UI_URL}/verify/${verificationToken}`,
  });
  if (!send) {
    throw new Error();
  }
  return user.email;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email, verify: true });
  if (!user) {
    throw new Error();
  }
  const decodePassword = await bcrypt.compare(password, user.password);
  if (!decodePassword) {
    throw new Error();
  }
  const token = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_SECRET_KEY
  );
  const updateUser = await User.findByIdAndUpdate(user._id, {
    $set: { token },
  });
  if (!updateUser) {
    throw new Error();
  }
  const { subscription, avatarURL } = user;
  return { user: { email: user.email, subscription, avatarURL }, token };
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
  const prevAvatar = user.avatarURL;
  if (user.avatarURL.includes(id)) {
    const splitUrl = prevAvatar.split("/");
    const avatarName = splitUrl.filter((i) => i.includes(id));
    const oldPath = path.resolve(`./public/avatars/${avatarName}`);
    await fs.unlink(oldPath);
  }
  const newAvatar = `${id}.${uuidv4()}.jpg`;
  const FILE_DESTINATION = path.resolve(`./public/avatars/${newAvatar}`);
  const FILE_READ = path.resolve(`./tmp/${filename}`);
  avatarFormater(FILE_READ, FILE_DESTINATION);
  const avatarURL = `${SERVER_URL}/avatars/${newAvatar}`;
  await User.findByIdAndUpdate(id, {
    $set: { avatarURL },
  });
  await fs.unlink(FILE_READ);
  return avatarURL;
};

const verificationUser = async (verificationToken) => {
  const user = await User.findOne({ verificationToken, verify: false });
  if (!user) {
    throw new Error();
  }
  await User.findByIdAndUpdate(user._id, {
    $set: { verificationToken: "verify", verify: true },
  });
  // return user;
};

const verifyUser = async (email) => {
  const user = await User.findOne({ email, verify: false });
  if (!user) {
    throw new Error();
  }
  const send = await verification({
    to: email,
    link: `${UI_URL}/verify/${user.verificationToken}`,
  });
  if (!send) {
    throw new Error();
  }
  return user;
};

const forgotPasswordUser = async (email) => {
  const user = await User.findOne({ email, verify: true });
  if (!user) {
    throw new Error();
  }
  const token = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_SECRET_KEY
  );
  const updateUser = await User.findByIdAndUpdate(user.id, {
    $set: { token },
  });
  if (!updateUser) {
    throw new Error();
  }
  const send = await restorePassword({
    to: email,
    link: `${UI_URL}/restorePassword/${token}`,
  });
  if (!send) {
    throw new Error();
  }
  return user;
};

const restorePasswordUser = async (_id, password) => {
  const user = await User.findOne({ _id, verify: true });
  if (!user) {
    throw new Error();
  }
  // const updatePasswordUser = await User.findByIdAndUpdate(user.id, {
  //   $set: { password },
  // });
  // if (!updatePasswordUser) {
  //   throw new Error();
  // }
  user.password = password;
  user.save();
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  updateSubscription,
  updateAvatar,
  verificationUser,
  verifyUser,
  forgotPasswordUser,
  restorePasswordUser,
};
