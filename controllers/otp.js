const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const otpGenerator=require("otp-generator");
const nodemailer=require("nodemailer");
const {PrismaClient} =require("@prisma/client")
const prisma = new PrismaClient()
const otpStore={};
const verifyEmail=async(req,res)=>{
    const { email } = req.body;
  const otp = otpGenerator.generate(6, { digits: true });
  // const hashedOTP=bcrypt.hash(otp,10);
  // otbObj = { otp, expiry: Date.now() + 300000 };
  otpStore[email] = { otp, expiry: Date.now() + 300000 };
  console.log(otpStore[email]);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "himakarhimmu@gmail.com",
      pass: "baanebdpycpwpwsu",
    }
  });

  const mailOptions = {
    from: "himakarhimmu@gmail.com",
    to: email,
    subject: 'Your OTP for Email Verification',
    text: `Your OTP is: ${otp}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send({ error: 'Failed to send OTP' });
    }
    res.status(200).send({ message: 'OTP sent successfully' });
  });
}


const verifyOtp=async(req,res)=>{
    const { email, otp } = req.body;

    // Retrieve the saved OTP from the session or database
    // console.log(otpStore);
    const storedOTP = otpStore[email];
    console.log(storedOTP);
    // const storedHashedOTP=await bcrypt.compare(otp,storedOTP.otp);
    if (!storedOTP) {
        return res.status(400).send('OTP not found');
      }
    
      if (storedOTP.expiry < Date.now()) {
        return res.status(400).send('OTP expired');
      }
    
      if (storedOTP.otp !== otp) {
        return res.status(400).send('Invalid OTP');
      }
        // const user = await prisma.user.update({
        //   where: { email: email },
        //   data: { isEmailVerified: true } 
        // });
        delete storedOTP[email];
        res.status(200);
      // alert("Email verified successfully");
      // res.redirect("/");
};



module.exports={
    verifyEmail,
    verifyOtp
}