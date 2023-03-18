const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const generateToken = require("../utils/generateToken");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendMail");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");

exports.signUp = asyncHandler(async (req, res, next) => {
  const excludedFields = ["isEmailVerified"];
  excludedFields.forEach((field) => {
    delete req.body[field];
  });
  const codes = generateOTP();
  req.body.verifyCode = codes.hashedOTP;
  req.body.verifyCodeExpiration = codes.otpExpiration;
  const user = await User.create(req.body);
  const emailOptions = {
    email: user.email,
    subject: "Email Verify Code",
    message: `Your Email Verify Code is ${codes.otp}. \n This code is valid for 10 Mins. Please don't share this code with any one`,
  };
  await sendEmail(emailOptions);
  res.status(201).json(user);
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(
      new ApiError("Invalid username or password. Please try again.", 400)
    );
  }
  const token = generateToken(user._id);
  res.status(200).json({ data: user, token });
});

exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const hashedOTP = crypto
    .createHash(process.env.HASHING_METHOD)
    .update(req.body.otp.toString())
    .digest("hex");
  const user = await User.findOne({
    email: req.body.email,
    verifyCode: hashedOTP,
    verifyCodeExpiration: { $gte: Date.now() },
  });
  if (!user) {
    return next(new ApiError(`OTP is invalid or expired`));
  }
  user.isEmailVerified = true;
  user.verifyCode = undefined;
  user.verifyCodeExpiration = undefined;
  await user.save();
  res.status(200).json(user);
});

exports.resendVerifyCode = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("There is no user with this email", 404));
  }
  const codes = generateOTP();
  user.verifyCode = codes.hashedOTP;
  user.verifyCodeExpiration = codes.otpExpiration;
  await user.save();
  const emailOptions = {
    email: user.email,
    subject: "Email Verify Code",
    message: `Your Email Verify Code is ${codes.otp}. \n This code is valid for 10 Mins. Please don't share this code with any one`,
  };
  await sendEmail(emailOptions);
  res.status(201).json(user);
});

