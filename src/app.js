require("dotenv").config({path: "config.env"});
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dbConnection = require('../db/dbConnection')
const globalError = require('../middlewares/errorMiddleware')
const mountRoutes = require('../routes')
const ApiError = require('../utils/apiError')


dbConnection();

const app = express();

// Enable other domains to access application
app.use(cors());
app.options("*", cors());

app.use(express.json())

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

mountRoutes(app)
app.use('*', (req, res, next) => {
  next(new ApiError(`Can't find this route ${req.originalUrl}`, 404));
})

app.use(globalError)

module.exports = app