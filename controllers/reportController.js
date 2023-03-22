const asyncHandler = require('express-async-handler')

const {getAll, getOne, deleteOne} = require('./utilsController')
const ApiError = require('../utils/apiError')
const Report = require('../models/reportModel')

exports.getReports = getAll(Report, 'Report')

exports.getSingleReport = getOne(Report)

exports.deleteReport = deleteOne(Report)