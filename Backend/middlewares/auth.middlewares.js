const userModel = require("../models/user.model");
const bcyrpt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blackListTokenModel = require("../models/blacklistToken.model");

module.exports.authUser = async (req, res, next) => {
  const token =
    req.cookies.token ||
    (req.headers.Authorization
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
    
    if (!user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    const userData = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      isAccountVerified: user.isAccountVerified,
      profilePicture: user.profilePicture,
    };
    req.user = userData;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
};
