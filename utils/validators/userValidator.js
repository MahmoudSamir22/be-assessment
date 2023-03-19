const { body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

exports.signUp = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid")
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error("This email is already taken");
      }
      return true;
    }),
  body("password").notEmpty().withMessage("Email is required"),
  validatorMiddleware,
];
