const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const authMiddileware = require("../middlewares/auth.middlewares");

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstname")
      .isLength({ min: 2 })
      .withMessage("Firstname must be at least 2 characters long"),
    body("fullname.lastname")
      .isLength({ min: 3 })
      .withMessage("Lastname must be at least 3 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password should be at least 6 characters long"),
  ],
  userController.registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("invalid email or password"),
    body("password").isLength({ min: 6 }),
  ],
  userController.loginUser
);
router.get("/profile", authMiddileware.authUser, userController.getUserProfile);
router.post("/logout", authMiddileware.authUser, userController.logoutUser);

// Email verification
router.post(
  "/verify/send-otp",
  authMiddileware.authUser,
  userController.sendVerificationOtp
);

router.post(
  "/verify",
  [body("otp").isLength({ min: 6, max: 6 }).withMessage("Invalid OTP")],
  authMiddileware.authUser,
  userController.verifyOtp
);

// Password reset
router.post(
  "/reset-password/send-otp",
  [body("email").isEmail().withMessage("Invalid Email")],
  userController.sendResetPasswordOtp
);
router.put(
  "/reset-password",
  [
    body("email").isEmail().withMessage("invalid Email"),
    body("otp").isLength({ min: 6, max: 6 }).withMessage("Invalid OTP"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password should be at least 6 characters long"),
  ],
  userController.resetPassword
);

//Update Profile
router.put(
  "/update-name",
  [
    body("fullname.firstname")
      .isLength({ min: 2 })
      .withMessage("Firstname must be at least 2 characters long"),
    body("fullname.lastname")
      .isLength({ min: 3 })
      .withMessage("Lastname must be at least 3 characters long"),
  ],
  authMiddileware.authUser,
  userController.updateName
);

router.put(
  "/update-profile-picture",
  [
    body("profilePicture")
      .isLength({ min: 1 })
      .withMessage("No image provided"),
  ],
  authMiddileware.authUser,
  userController.updateProfilePicture
);

router.put(
  "/update-password",
  [
    body("oldPassword")
      .isLength({ min: 6 })
      .withMessage("Incorrect old password"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password should be at least 6 characters long"),
  ],
  authMiddileware.authUser,
  userController.updatePassword
);


router.use("*", (req, res) => {
  return res.status(404).json({
    message: "Sorry, we couldn't find that page. Please check the URL.",
  });
});

module.exports = router;
