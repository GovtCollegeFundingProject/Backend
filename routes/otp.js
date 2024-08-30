const express = require("express");
const router = express.Router();
const {
  requestOtp,
  verifyOtp,
  resendOtp,
  checkOtpStatus,
} = require("../controllers/otpService");

router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.get("/check-otp-status", checkOtpStatus);

module.exports = router;
