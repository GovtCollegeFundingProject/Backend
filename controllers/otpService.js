const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
require("dotenv").config();

const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate OTP
function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

// Send OTP email
async function sendOtpEmail(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  };
  await transporter.sendMail(mailOptions);
}

// Request OTP endpoint
async function requestOtp(req, res) {
  const { email } = req.body;
  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  const token = jwt.sign(
    { email, otpHash, exp: Date.now() + OTP_EXPIRATION_TIME },
    process.env.JWT_SECRET
  );

  await sendOtpEmail(email, otp);
  res.json({ message: "OTP sent to email", token });
}

// Verify OTP endpoint
async function verifyOtp(req, res) {
  const { email, otp, token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email !== email || Date.now() > decoded.exp) {
      return res.status(400).json({ message: "Invalid OTP or OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp, decoded.otpHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
}

// Resend OTP endpoint
async function resendOtp(req, res) {
  const { email } = req.body;
  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  const token = jwt.sign(
    { email, otpHash, exp: Date.now() + OTP_EXPIRATION_TIME },
    process.env.JWT_SECRET
  );

  await sendOtpEmail(email, otp);
  res.json({ message: "New OTP sent to email", token });
}

// Check OTP status endpoint
function checkOtpStatus(req, res) {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (Date.now() > decoded.exp) {
      return res.json({ isValid: false, message: "OTP expired" });
    }
    res.json({ isValid: true, message: "OTP is still valid" });
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
}

module.exports = { requestOtp, verifyOtp, resendOtp, checkOtpStatus };
