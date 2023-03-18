const asyncHandler = require('express-async-handler')

const ApiError = require('../utils/apiError')
const Check = require('../models/checkModel')

exports.addCheck = asyncHandler(async (req, res, next) => {
    const check = await Check.create({
        ...req.body,
        user: req.user
    })
    res.status(201).json(check)
})

exports.getChecks = asyncHandler(async (req, res, next) => {

})

exports.getSingleCheck = asyncHandler(async (req, res, next) => {})

exports.updateCheck = asyncHandler(async (req, res, next) => {})

exports.deleteCheck = asyncHandler(async (req, res, next) => {})
