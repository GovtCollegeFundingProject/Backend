// import { PrismaClient } from '@prisma/client'
const {PrismaClient} =require("@prisma/client")
const prisma = new PrismaClient()
const cors=require("cors");

const express=require("express");
const app=express();
const authRoute=require("./routes/auth");
const otpRoute=require("./routes/otp")
const PORT=3000||process.env.PORT;
app.use(express.json());
app.use(cors());
app.use("/auth",authRoute);
app.use("/otp",otpRoute);
app.get("/",(req,res)=>{
    res.send("<h1>Hello</h1>")
})

app.listen(PORT,()=>{
    console.log(`Server Listening on PORT ${PORT}`);
})



