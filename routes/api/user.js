const express = require("express");
const router = express.Router();
const { asyncWrapper } = require("../../helpers/apiHelpers");
const {
  userValidation,
  subscriptionValidation,
  emailValidation,
  passwordValidation,
} = require("../../middleware/validationMiddlware");
const {
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
} = require("../../controllers/userControllers");
const { authMiddleware } = require("../../middleware/authMiddleware");
const { uploadMiddleware } = require("../../middleware/uploadMiddleware");

router.post(
  "/users/register",
  userValidation,
  asyncWrapper(registerUserController)
);
router.get("/users/login", userValidation, asyncWrapper(loginUserController));
router.post(
  "/users/logout",
  authMiddleware,
  asyncWrapper(logoutUserController)
);
router.get(
  "/users/current",
  authMiddleware,
  asyncWrapper(currentUserController)
);
router.patch(
  "/users",
  authMiddleware,
  subscriptionValidation,
  asyncWrapper(updateSubscriptionController)
);
router.patch(
  "/users/avatars",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  asyncWrapper(updateAvatarController)
);

router.get(
  "/users/verify/:verificationToken",
  asyncWrapper(verificationUserController)
);

router.post(
  "/users/verify",
  emailValidation,
  asyncWrapper(verifyUserController)
);

router.post(
  "/users/forgotPassword",
  emailValidation,
  asyncWrapper(forgotPasswordUserController)
);

router.post(
  "/users/restorePassword",
  authMiddleware,
  passwordValidation,
  asyncWrapper(restorePasswordUserController)
);

module.exports = router;
