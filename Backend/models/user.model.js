const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [2, "First name should be at least two characters long"],
    },
    lastname: {
      type: String,
      required: true,
      minlength: [3, "Last name should be at least three characters long"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: [6, "Password must be at least six characters long"],
  },
  verifyOtp: {
    type: String,
    default: null,
  },
  verifyOtpExpireAt: {
    type: Date,
    default: null,
  },
  isAccountVerified: {
    type: Boolean,
    default: false,
  },
  resetOtp: {
    type: String,
    default: "",
  },
  resetOtpExpireAt: {
    type: Date,
    default: 0,
  },

  profilePicture: {
    type: String,
    default:
      "https://res.cloudinary.com/kz-cloud/image/upload/v1739721991/gbl7pu9pdzw5w3wkxuqp.svg",
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
