const crypto = require("crypto");

const generateOTP = () => {
  const otpExpiration = Date.now() + 10 * 60 * 1000;
  const otp = Math.floor(100000 + Math.random() * 900000);
  const hashedOTP = crypto
    .createHash(process.env.HASHING_METHOD)
    .update(otp.toString())
    .digest("hex");
  return { otp, hashedOTP, otpExpiration};
};

module.exports = generateOTP;
