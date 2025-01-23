const userModel = require("../models/user.model");
const bcyrpt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blackListTokenModel = require("../models/blacklistToken.model");
const captainModel = require("../models/captain.model");

module.exports.authUser = async (req, res, next) => {
  const token =
    req.cookies.token ||
    (req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : undefined);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const isBlacklisted = await blackListTokenModel.findOne({ token: token });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decode._id);
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
};

module.exports.authCaptian = async (req, res, next) => {
  const token =
    req.cookies.token ||
    (req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : undefined);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const isBlacklisted = await blackListTokenModel.findOne({ token: token });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainModel.findById(decode._id);
    req.captain = captain;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
};
