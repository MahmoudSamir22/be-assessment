const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const ApiError = require("../utils/apiError");
const User = require("../models/userModel");

const auth = asyncHandler(async (req, res, next) => {
  let token;
  // check if token existed
  if (req.headers.authorization) {
    token = req.headers.authorization.replace("Bearer ", "");
  }
  // if token not existed throw an error
  if (!token) {
    return next(
      new ApiError("UnAuthorized User, please login with valid Account", 401)
    );
  }
  // decode token and find user
  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId);
  // if user not existed throw an error
  if (!user) {
    return next(
      new ApiError("The user that belong to this token no longer exist", 401)
    );
  }
  // set user id to the req
  req.user = user._id;
  next();
});

module.exports = auth;
