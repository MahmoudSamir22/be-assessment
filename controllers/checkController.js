const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const Check = require("../models/checkModel");

exports.addCheck = asyncHandler(async (req, res, next) => {
  const check = await Check.create({
    ...req.body,
    user: req.user,
  });
  res.status(201).json(check);
});

exports.getChecks = asyncHandler(async (req, res, next) => {
  const checks = await Check.find({ user: req.user });
  res.status(200).json(checks);
});

exports.getSingleCheck = asyncHandler(async (req, res, next) => {
  const check = await Check.findOne({ _id: req.params.id, user: req.user });
  if (!check) {
    return next(
      new ApiError(`Invalid check id or this user dosn't own this check`, 404)
    );
  }
  res.status(200).json(check);
});

exports.updateCheck = asyncHandler(async (req, res, next) => {
  const check = await Check.findOneAndUpdate(
    { _id: req.params.id, user: req.user },
    req.body,
    {
      new: true,
    }
  );
  if (!check) {
    return next(
      new ApiError(`Invalid check id or this user dosn't own this check`, 404)
    );
  }
  res.status(200).json(check);
});

exports.deleteCheck = asyncHandler(async (req, res, next) => {
  const check = await Check.findOneAndRemove(
    { _id: req.params.id, user: req.user },
    req.body,
    {
      new: true,
    }
  );
  if (!check) {
    return next(
      new ApiError(`Invalid check id or this user dosn't own this check`, 404)
    );
  }
  res.status(204).send();
});
