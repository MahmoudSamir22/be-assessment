const {getAll, getOne, deleteOne} = require('./utilsController')
const Report = require('../models/reportModel')

// @desc Get All reports belongs to logged in user
// @route GET /api/report/
// @access Private
exports.getReports = getAll(Report, 'Report')
// @desc Get Single report if it belongs to logged in user
// @route GET /api/report/:id
// @access Private
exports.getSingleReport = getOne(Report)
// @desc Delete report if it belongs to logged in user
// @route DELETE /api/report/:id
// @access Private
exports.deleteReport = deleteOne(Report)