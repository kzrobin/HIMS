const bcrypt = require("bcrypt");
const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.services");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/blacklistToken.model");

// Captian registreation
module.exports.registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);

  // Check validation errors
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password, vehicle } = req.body;

  console.log(req.body);

  try {
    // Hash the password
    const hashedPassword = await captainModel.hashPassword(password);

    // Add captain to database
    const captain = await captainService.createCaptain({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
      color: vehicle.color,
      vehicleType: vehicle.vehicleType,
      capacity: vehicle.capacity,
      plate: vehicle.plate,
    });

    // Generate the token
    const token = captain.generateAuthToken();

    // Respond with the token and captain data
    res.status(201).json({ token, captain });
  } catch (err) {
    console.error(err.message);
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
  }
};

//Capatin Login
module.exports.loginCaptain = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select("+password");

    if (!captain) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the password
    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = captain.generateAuthToken();

    res.cookie("token", token);
    return res.status(200).json({ token, captain });
  } catch (error) {
    console.error("Error in loginCaptain:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//Captain Logout
module.exports.logoutCaptain = async (req, res, next) => {
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
    await blackListTokenModel.create({ token });

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

//Captain profile
module.exports.getCaptainProfile = async (req, res, next) => {
  res.status(200).json({ captain: req.captain });
};
