const {
  BadRequest,
  Conflict,
  Unauthorized,
  NotFound,
} = require("../helpers/errors");
const {
  registerUser,
  loginUser,
  logoutUser,
  updateSubscription,
  updateAvatar,
  verificationUser,
  verifyUser,
  forgotPasswordUser,
  restorePasswordUser,
} = require("../services/usersService");

const registerUserController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const register = await registerUser(email, password);
    res.status(201).json({ email: register });
  } catch (error) {
    throw new Conflict();
  }
};

const loginUserController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const login = await loginUser(email, password);
    res.json({ ...login });
  } catch (error) {
    throw new Unauthorized("Email or password is wrong");
  }
};

const logoutUserController = async (req, res) => {
  const { _id } = req.user;
  await logoutUser(_id);
  res.status(204).json({});
};

const currentUserController = async (req, res) => {
  const { email, subscription, token, avatarURL } = req.user;
  res.json({ user: { email, subscription, avatarURL }, token });
};

const updateSubscriptionController = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  if (!subscription) {
    throw new BadRequest("missing field subscription");
  }
  try {
    await updateSubscription(_id, subscription);
    res.json({
      message: `subscription updated to: ${subscription}`,
      subscription,
    });
  } catch (error) {
    throw new BadRequest(
      "subscription can be only ['starter', 'pro', 'business']"
    );
  }
};

const updateAvatarController = async (req, res) => {
  const filename = req.file.filename;
  if (!filename) {
    throw new BadRequest("missing required field ");
  }
  try {
    const url = await updateAvatar(req, filename);
    res.json({ avatarURL: `${url}` });
  } catch (error) {
    throw new BadRequest("Something wrong( Try again");
  }
};

const verificationUserController = async (req, res) => {
  const { verificationToken } = req.params;
  if (!verificationToken) {
    throw new NotFound("Something wrong(. Try again");
  }
  try {
    await verificationUser(verificationToken);
    res.json({ message: "Verification successful" });
  } catch (error) {
    throw new NotFound("User not found");
  }
};

const verifyUserController = async (req, res) => {
  const { email } = req.body;
  try {
    await verifyUser(email);
    res.json({ message: "Verification email sent" });
  } catch (error) {
    throw new BadRequest("Verification has already been passed");
  }
};

const forgotPasswordUserController = async (req, res) => {
  const { email } = req.body;
  try {
    await forgotPasswordUser(email);
    res.json({ message: "Restore email sent" });
  } catch (error) {
    throw new BadRequest("Something wrong( Try again");
  }
};

const restorePasswordUserController = async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  try {
    await restorePasswordUser(_id, password);
  } catch (error) {
    throw new BadRequest("Something wrong( Try again");
  }
  res.json({ message: "Password was change" });
};

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  currentUserController,
  updateSubscriptionController,
  updateAvatarController,
  verificationUserController,
  verifyUserController,
  forgotPasswordUserController,
  restorePasswordUserController,
};
