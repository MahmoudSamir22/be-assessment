const asyncHandler = require("express-async-handler");

const { checkUrl } = require("../utils/monitor");
const {getAll, getOne, deleteOne} = require('./utilsController')
const ApiError = require("../utils/apiError");
const Check = require("../models/checkModel");

// @desc Get All checks belongs to logged in user
// @route GET /api/check/
// @access Private
exports.getChecks = getAll(Check, 'Check')
// @desc Get Single Check if it belongs to logged in user
// @route GET /api/check/:id
// @access Private
exports.getSingleCheck = getOne(Check)
// @desc Delete Check if it belongs to logged in user
// @route DELETE /api/check/:id
// @access Private
exports.deleteCheck = deleteOne(Check)
// @desc Add new check 
// @route POST /api/check/
// @access Private
exports.addCheck = asyncHandler(async (req, res, next) => {
  const check = await Check.create({
    ...req.body,
    owner: req.user,
  });
  checkUrl(check);
  setInterval(() => {
    checkUrl(check);
  }, check.interval * 1000 * 60);
  res.status(201).json(check);
});
// @desc Update Check
// @route PUT /api/check/:id
// @access Private
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


