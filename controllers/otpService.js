const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
// const bcryptPassword = require("bcrypt");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const { errorHandler } = require("../middlewares/error.js");

const prisma = new PrismaClient();
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
async function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

// Send OTP email
async function sendOtpEmail(email, otp, subject, text) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: text,
  };
  await transporter.sendMail(mailOptions);
}

// Request OTP endpoint
async function requestOtp(req, res, next) {
  try {
    const email = req.userEmail;
    console.log(email);
    const otp = await generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const token = jwt.sign(
      { email, otpHash, exp: Date.now() + OTP_EXPIRATION_TIME },
      process.env.JWT_SECRET
    );

    await sendOtpEmail(
      email,
      otp,
      "Your OTP Code",
      `Your OTP code is ${otp}. It will expire in 5 minutes.`
    );
    res.json({ message: "OTP sent to email", token });
  } catch (err) {
    next(err);
  }
}

// Verify OTP endpoint
async function verifyOtp(req, res, next) {
  const email = req.userEmail;
  const { otp, token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email !== email || Date.now() > decoded.exp) {
      return next(errorHandler(400, "Invalid OTP or OTP expired"));
    }

    const isMatch = await bcrypt.compare(otp, decoded.otpHash);
    if (!isMatch) {
      return next(errorHandler(400, "Invalid OTP"));
    }
    await prisma.user.update({
      where: { email },
      data: { isEmailVerified: true },
    });

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    next(err);
  }
}

// Resend OTP endpoint
async function resendOtp(req, res, next) {
  try {
    const { email } = req.userEmail;
    const otp = await generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const token = jwt.sign(
      { email, otpHash, exp: Date.now() + OTP_EXPIRATION_TIME },
      process.env.JWT_SECRET
    );

    await sendOtpEmail(
      email,
      otp,
      "Your OTP Code",
      `Your OTP code is ${otp}. It will expire in 5 minutes.`
    );
    res.json({ message: "New OTP sent to email", token });
  } catch (err) {
    next(err);
  }
}

// Check OTP status endpoint
async function checkOtpStatus(req, res, next) {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (Date.now() > decoded.exp) {
      return res.json({ isValid: false, message: "OTP expired" });
    }
    res.json({ isValid: true, message: "OTP is still valid" });
  } catch (err) {
    next(err);
  }
}

// Generate and send new password endpoint
async function generatePassword() {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}
async function forgetPassword(req, res, next) {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return next(errorHandler(404, "Bro create account first!!"));
    }

    const newPassword = await generatePassword();

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    await sendOtpEmail(
      email,
      newPassword,
      "Your new password",
      `Your new password is ${newPassword}.`
    );

    return res.status(200).json({ message: "new password sent to mail" });
  } catch (err) {
    next(err);
  }
}
module.exports = {
  requestOtp,
  verifyOtp,
  resendOtp,
  checkOtpStatus,
  forgetPassword,
};
