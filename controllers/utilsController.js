const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

// @desc Get All documents
// @route GET
exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.queryFilter) {
      filter = req.queryFilter;
    }
    const documentsCount = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCount)
      .filtering()
      .search(modelName)
      .limitFields()
      .sort();
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;
    res.status(200).json({ paginationResult, data: documents });
  });
// @desc Get Single documents
// @route GET
exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    let filter = { _id: req.params.id };
    if (req.queryFilter) {
      filter = req.queryFilter;
    }
    const document = await Model.findOne(filter);
    if (!document) {
      return next(new ApiError("Document not found", 404));
    }
    res.status(200).json(document);
  });
// @desc Delete Single Document
// @route DELETE
exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    let filter = { _id: req.params.id };
    if (req.queryFilter) {
      filter = req.queryFilter;
    }
    const document = await Model.findOneAndDelete(filter);
    if (!document) {
      return next(new ApiError("Document not found", 404));
    }
    res.status(204).json();
  });
// @desc Set custom filter
// @access Middleware
exports.setOwnerFilter = asyncHandler((req, res, next) => {
  if (req.queryFilter) {
    const filter = { ...req.queryFilter, owner: req.user };
    req.queryFilter = filter;
  } else {
    req.queryFilter = { owner: req.user };
  }
  next();
});
// @desc Set custom filter
// @access Middleware
exports.setIdFilter = asyncHandler((req, res, next) => {
  if (req.queryFilter) {
    const filter = { ...req.queryFilter, _id: req.params.id };
    req.queryFilter = filter;
  } else {
    req.queryFilter = { _id: req.params.id };
  }
  next();
});
// @desc Set custom filter
// @access Middleware
exports.setTagsFilter = asyncHandler((req, res, next) => {
  if (req.queryFilter) {
    const filter = { ...req.queryFilter, tags: { $in: req.body.tag } };
    req.queryFilter = filter;
  } else {
    req.queryFilter = { tags: { $in: req.body.tag } };
  }
  next();
});
