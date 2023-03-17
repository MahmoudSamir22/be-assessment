require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dbConnection = require('./db/dbConnection')
const globalError = require('./middlewares/errorMiddleware')
const mountRoutes = require('./routes')
const ApiError = require('./utils/apiError')

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
  next(new ApiError(`Can't find this route ${req.originalUrl}`, 400));
})

app.use(globalError)

app.listen(process.env.PORT, () => {
  console.log(`Server is up and running on port: ${process.env.PORT}`);
});
