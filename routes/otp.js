const express=require("express");
const router=express.Router();
const {verifyEmail,verifyOtp}=require("../controllers/otp")
router.post("/verifyemail",verifyEmail);
router.post("/verifyotp",verifyOtp);

module.exports=router;