const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const generateToken = require("../utils/generateToken");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");

exports.signUp = asyncHandler(async (req, res, next) => {
  const excludedFields = ["isEmailVerified"];
  excludedFields.forEach((field) => {
    delete req.body[field];
  });
  const user = await User.create(req.body);
  res.status(201).json(user);
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(user.password, req.body.password))) {
    return next(
      new ApiError("Invalid username or password. Please try again.", 400)
    );
  }
  const token = generateToken(user._id);
  res.status(200).json({ data: user, token });
});
