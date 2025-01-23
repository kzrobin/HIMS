const { compare } = require("bcrypt");
const userModel = require("../models/user.model");
const BlacklistTokenModel = require("../models/blacklistToken.model");
const userService = require("../services/user.services");
const { validationResult, cookie } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(req.body);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password } = req.body;
  // console.log(fullname);

  // Hash the paaaword
  const hashedPassword = await userModel.hashPassword(password);

  // add user to database
  const user = await userService
    .createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
    })
    .then(() => {
      const token = user.generateAuthToken();
      res.status(201).json({ token, user });
    })
    .catch((err) => {
      // Input validation
      if (err.name === "ValidationError") {
        res.status(400).json({
          message: "Data validation error",
          details: err.message,
        });
      } else if (err.code === 11000) {
        // MongoDB duplicate key error
        res.status(409).json({
          message: "Email already exists",
        });
      } else {
        res.status(500).json({
          message: "Internal server error",
          error: err.message,
        });
      }
    });
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erros: errors.array() });
  }

  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = user.generateAuthToken();
  res.cookie("token", token);
  return res.status(200).json({ token, user });
};

module.exports.getUserProfile = (req, res, next) => {
  res.status(200).json(req.user);
};

module.exports.logoutUser = async (req, res, next) => {
  try {
    // Extract the token from cookies or Authorization header
    const token =
      req.cookies.token ||
      (req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : undefined);

    // No token has found
    if (!token) {
      return res.status(400).json({ message: "Unauthorized access" });
    }

    // Add the token to the blacklist
    await blacklistTokenModel.create({ token });

    // Clear the cookie
    res.clearCookie("token");

    // Send success response
    return res.status(200).json({ message: "Logout Successfully" });
  } catch (err) {
    // Unexpected errors
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
