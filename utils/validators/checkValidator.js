const { body, check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const httpProtocols = ["HTTP", "HTTPS", "TCP"];

exports.addCheckValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("url")
    .notEmpty()
    .withMessage("URL is required"),
    // .isURL()
    // .withMessage("Please enter a valid url"),
  body("protocol")
    .notEmpty()
    .withMessage("Protocol is required")
    .isIn(httpProtocols)
    .withMessage(`Protocol Should be in ${httpProtocols}`),
  body("path")
    .optional()
    .isString()
    .withMessage("Path should be a string")
    .custom((val) => {
      if (!val.startsWith("/")) {
        throw new Error(
          'Please enter a valid Path. Path should start with "/"'
        );
      }
      return true;
    }),
  body("port").optional().isNumeric().withMessage("Port should be a number"),
  body("webhook").optional().isURL().withMessage("Please enter a valid URL"),
  body("timeout")
    .optional()
    .isNumeric()
    .withMessage("timeout should be a number"),
  body("interval")
    .optional()
    .isNumeric()
    .withMessage("interval should be a number"),
  body("threshold")
    .optional()
    .isNumeric()
    .withMessage("threshold should be a number"),
  body("authentication.username")
    .if(body("authentication").exists())
    .notEmpty()
    .withMessage("Username is required when authentication exists"),
  body("authentication.password")
    .if(body("authentication").exists())
    .notEmpty()
    .withMessage("Passowrd is required when authentication exists"),
  body("httpHeaders.*.key")
    .if(body("httpHeaders").exists())
    .notEmpty()
    .withMessage("Key is required when Http Headers exists"),
  body("httpHeaders.*.value")
    .if(body("httpHeaders").exists())
    .notEmpty()
    .withMessage("Value is required when Http Headers exists"),
  body("assert").exists(),
  body("assert.statusCode")
    .if(body("assert").exists())
    .notEmpty()
    .withMessage("StatusCode is required when Http Headers exists")
    .isNumeric()
    .withMessage("Status Code Should be a number"),
  body("ignoreSSL")
    .optional()
    .isBoolean()
    .withMessage("ignoreSSL should be boolean"),
  validatorMiddleware,
];

exports.getSingleCheckValidator = [
  check("id").isMongoId().withMessage("Please enter a valid id"),
  validatorMiddleware,
];

exports.deleteCheckValidator = [
  check("id").isMongoId().withMessage("Please enter a valid id"),
  validatorMiddleware,
];
