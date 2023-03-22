const asyncHandler = require("express-async-handler");

const { checkUrl } = require("../utils/monitor");
const {getAll, getOne, deleteOne} = require('./utilsController')
const ApiError = require("../utils/apiError");
const Check = require("../models/checkModel");

exports.getChecks = getAll(Check, 'Check')

exports.getSingleCheck = getOne(Check)

exports.deleteCheck = deleteOne(Check)

exports.addCheck = asyncHandler(async (req, res, next) => {
  const check = await Check.create({
    ...req.body,
    user: req.user,
  });
  checkUrl(check);
  setInterval(() => {
    checkUrl(check);
  }, check.interval * 1000 * 60);
  res.status(201).json(check);
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
  checkUrl(check);
  setInterval(() => {
    checkUrl(check);
  }, check.interval * 1000 * 60);
  res.status(200).json(check);
});


