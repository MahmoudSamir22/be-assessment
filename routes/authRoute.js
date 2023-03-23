const router = require("express").Router();

const {
  signUp,
  login,
  verifyEmail,
  resendVerifyCode,
} = require("../controllers/authController");

const auth = require('../middlewares/auth')


router.post("/signup", signUp);

router.post("/login", login);

router.put("/verifyEmail", verifyEmail);

router.post('/resendVerifyCode', resendVerifyCode)

module.exports = router;
