const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const ApiError = require("../utils/apiError");
const User = require("../models/userModel");

const auth = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.replace("Bearer ", "");
  }
  if (!token) {
    return next(
      new ApiError("UnAuthorized User, please login with valid Account", 401)
    );
  }
  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId);
  if (!user) {
    return next(
      new ApiError("The user that belong to this token no longer exist", 401)
    );
  }
  req.user = user._id;
  next();
});

module.exports = auth;
