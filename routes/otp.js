const express = require("express");
const router = express.Router();
const {
  requestOtp,
  verifyOtp,
  resendOtp,
  checkOtpStatus,
  forgetPassword,
} = require("../controllers/otpService");
const { extractEmailFromToken } = require("../middlewares/email");

router.post("/request-otp", extractEmailFromToken, requestOtp);
router.post("/verify-otp", extractEmailFromToken, verifyOtp);
router.post("/resend-otp", extractEmailFromToken, resendOtp);
router.get("/check-otp-status", extractEmailFromToken, checkOtpStatus);
router.post("/forget-password", forgetPassword);

module.exports = router;
