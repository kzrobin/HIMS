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

router.get("/logout", authMiddileware.authUser, userController.logoutUser);

module.exports = router;
