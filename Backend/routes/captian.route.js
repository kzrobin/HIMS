const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const captainController = require("../controllers/captain.controller");
const authMiddleware = require("../middlewares/auth.middlewares");

router.post("/", (req, res) => {
  res.send("Successed");
});
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("Firstname must be at least 2 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password should be at least 6 characters long"),
    body("vehicle.vehicleType")
      .isIn(["Car", "Motorcycle", "Auto"])
      .withMessage("Invalid type"),
    body("vehicle.plate")
      .isLength({ min: 3 })
      .withMessage("Plate must be at least 3 characters long"),
    body("vehicle.color")
      .isLength({ min: 3 })
      .withMessage("Color must be at least 3 characters long"),
    body("vehicle.capacity")
      .isInt({ min: 1 })
      .withMessage("Capacity must be at least 1"),
  ],
  captainController.registerCaptain
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("invalid email or password"),
    body("password").isLength({ min: 6 }),
  ],
  captainController.loginCaptain
);

router.get(
  "/profile",
  authMiddleware.authCaptian,
  captainController.getCaptainProfile
);

router.get("/logout", authMiddleware.authCaptian, captainController.logoutCaptain)


module.exports = router;
