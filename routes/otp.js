const express = require("express");
const router = express.Router();
const {
  requestOtp,
  verifyOtp,
  resendOtp,
  checkOtpStatus,
  forgetPassword
} = require("../controllers/otpService");

router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.get("/check-otp-status", checkOtpStatus);
router.post("/forget-password", forgetPassword);

module.exports = router;
