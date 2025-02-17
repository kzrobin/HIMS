const userModel = require("../models/user.model");
const BlacklistTokenModel = require("../models/blacklistToken.model");
const userService = require("../services/user.services");
const { validationResult, cookie } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");
const { sendMail } = require("../config/sendmail.config.js");
const {
  welcomeMsg,
  verificationOtpMsg,
  resetPassorwdOtpMsg,
} = require("../config/emailTamplates.config.js");

// user register
module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array(), message: "Data validation error" });
  }

  try {
    const { fullname, email, password } = req.body;
    // Hash the password
    const hashedPassword = await userModel.hashPassword(password);
    // Add user to database
    const user = await userService.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
      trialStartDate: new Date(),
      trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Generate authentication token
    const token = user.generateAuthToken();

    // Sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to HIMS",
      html: welcomeMsg.replace(
        "{{name}}",
        fullname.firstname + " " + fullname.lastname
      ),
    };
    await sendMail(mailOptions);
    // set cookie
    res.cookie("token", token);
    // send response
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        isPremium: user.isPremium,
        isAccountVerified: user.isAccountVerified,
        profilePicture: user.profilePicture,
        trialStartDate: user.trialStartDate,
        trialEndDate: user.trialEndDate,
      },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({
        message: "Data validation error",
        details: err.message,
      });
    } else if (err.code === 11000) {
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

//user login
module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array(), message: "Data validation error" });
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

  return res.status(200).json({
    token,
    user: {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      isPremium: user.isPremium,
      isAccountVerified: user.isAccountVerified,
      profilePicture: user.profilePicture,
      trialStartDate: user.trialStartDate,
      trialEndDate: user.trialEndDate,
      isTrialActive: user.isTrialActive(),
    },
  });
};

//user profile
module.exports.getUserProfile = (req, res, next) => {
  res.status(200).json({ user: req.user });
};

// user logout
module.exports.logoutUser = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      (req.headers.Authorization
        ? req.headers.authorization.split(" ")[1]
        : undefined);

    if (!token) {
      return res.status(400).json({ message: "Unauthorized access" });
    }

    // Add the token to the blacklist
    await blacklistTokenModel.create({ token });

    // Clear the cookie
    res.clearCookie("token");

    // response
    return res.status(200).json({ message: "Logout Successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

// OTP request to verify mail
module.exports.sendVerificationOtp = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    } else if (user.isAccountVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 3600 * 1000;
    await user.save();
    const fullname = user.fullname;
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account verification OTP",
      html: verificationOtpMsg
        .replace("{{name}}", fullname.firstname + " " + fullname.lastname)
        .replace("{{otp}}", otp),
    };

    try {
      await sendMail(mailOptions);
      return res
        .status(200)
        .json({ message: "Verification OTP has been sent on Email" });
    } catch (mailError) {
      console.error("Error sending email:", mailError);
      user.verifyOtp = null;
      user.verifyOtpExpireAt = null;
      await user.save();
      return res.status(500).json({
        message: "Error sending verification email. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Get otp errors", error);
    return res.status(500).json({ message: error.message });
  }
};

//Verify mail with OTP
module.exports.verifyOtp = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Data validation error" });
    }
    const userId = req.user._id;
    const { otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: "Data validation error" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    } else if (user.isAccountVerified) {
      return res.status(400).json({ message: "User already verified" });
    } else if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    } else if (user.verifyOtpExpireAt && user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({ message: "OTP Expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = null;
    user.verifyOtpExpireAt = null;
    await user.save();

    return res.status(200).json({
      message: "Account successfully verified",
    });
  } catch (error) {
    console.error("Match OTP errors", error);
    return res.status(500).json({
      error: error.message,
      message: "Internal server error",
    });
  }
};

// user status of authentication
module.exports.isAuthenticated = async (req, res, next) => {
  try {
    if (req.user) {
      return res.status(200).json({ user: req.user });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Send reset otp
module.exports.sendResetPasswordOtp = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Data validation error" });
    }
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 24 * 3600 * 1000;
    await user.save();
    const fullname = user.fullname;
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP for HIMS",
      html: resetPassorwdOtpMsg
        .replace("{{name}}", fullname.firstname + " " + fullname.lastname)
        .replace("{{otp}}", otp),
    };

    try {
      await sendMail(mailOptions);
      return res.status(200).json({
        message: "OTP has been sent to your email address",
      });
    } catch (mailError) {
      console.error("Error sending reset OTP email:", mailError);
      user.resetOtp = null;
      user.resetOtpExpireAt = null;
      await user.save();
      return res.status(500).json({
        message: "Error sending reset OTP email. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Error in sendResetOtp:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
};

// reset password
module.exports.resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Data validation error" });
    }

    const { email, otp, newPassword } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP.",
      });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({
        message: "OTP expired.",
      });
    }

    const hashedPassword = await userModel.hashPassword(newPassword);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = null;
    await user.save();

    return res.status(200).json({
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//update name
module.exports.updateName = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Data validation error" });
    }

    const { fullname } = req.body;

    // Fetch the user
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the trial is active or if the user is premium
    if (!user.isTrialActive() && !user.isPremium) {
      return res.status(403).json({
        message: "Your free trial has expired. Please subscribe to premium.",
      });
    }

    // Update the user's name
    user.fullname = fullname;
    await user.save();

    return res.status(200).json({
      message: "Name updated successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        isPremium: user.isPremium,
        isAccountVerified: user.isAccountVerified,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
};

// Update profie picture
module.exports.updateProfilePicture = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Invalid profile picture" });
    }

    const { profilePicture } = req.body;

    // Fetch the user
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the trial is active or if the user is premium
    if (!user.isTrialActive() && !user.isPremium) {
      return res.status(403).json({
        message: "Your free trial has expired. Please subscribe to premium.",
      });
    }

    // Check if user is premium (if profile picture update is restricted to premium users)
    if (!user.isPremium) {
      return res.status(403).json({
        message: "You must be a premium member to update your profile picture",
      });
    }

    // Update profile picture
    user.profilePicture = profilePicture;
    await user.save();

    return res.status(200).json({
      message: "Profile picture updated successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        isPremium: user.isPremium,
        isAccountVerified: user.isAccountVerified,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Internal server error" });
  }
};

// update password
module.exports.updatePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Data validation error" });
    }
    const { oldPassword, newPassword } = req.body;
    const user = await userModel.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (oldPassword === newPassword) {
      return res
        .status(400)
        .json({ message: "New password cannot be the same as old password" });
    }
    if (!(await user.comparePassword(oldPassword)))
      return res.status(400).json({ message: "Incorrect old password" });
    user.password = await userModel.hashPassword(newPassword);
    await user.save();
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
};

module.exports.subscribePremium = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id); // Find the user by ID
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is already premium
    if (user.isPremium) {
      return res
        .status(400)
        .json({ message: "You are already a premium user" });
    }

    // Update the user to premium
    user.isPremium = true;
    await user.save();

    return res.status(200).json({
      message: "Subscription successful. You are now a premium user",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        isPremium: user.isPremium,
        isAccountVerified: user.isAccountVerified,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
};
