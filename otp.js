const dotenv=require('dotenv')
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors=require("cors");
const app = express();
app.use(bodyParser.json());
app.use(cors());
const otpStore = {};  // Temporary store for OTPs

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "himakarhimmu@gmail.com",
    pass: "baanebdpycpwpwsu",
  }
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function sendOTP(email, otp) {
  const mailOptions = {
    from: "himakarhimmu@gmail.com",
    to: email,
    subject: 'Your OTP for Email Verification',
    text: `Your OTP is: ${otp}`
  };

  return transporter.sendMail(mailOptions);
}

app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();

  try {
    await sendOTP(email, otp);
    otpStore[email] = { otp, expiry: Date.now() + 300000 };  // Store OTP for 5 minutes
    res.send('OTP sent to your email');
  } catch (error) {
    res.status(500).send('Failed to send OTP');
  }
});

app.post('/verify', (req, res) => {
  const { email, otp } = req.body;
  const storedOTP = otpStore[email];

  if (!storedOTP) {
    return res.status(400).send('OTP not found');
  }

  if (storedOTP.expiry < Date.now()) {
    return res.status(400).send('OTP expired');
  }

  if (storedOTP.otp !== otp) {
    return res.status(400).send('Invalid OTP');
  }

  delete otpStore[email];  // Clean up after verification
  res.send('Email verified successfully');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
