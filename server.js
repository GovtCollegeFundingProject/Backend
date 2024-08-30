const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const authRoute = require("./routes/auth");
const otpService = require("./routes/otp");
const PORT = 3000 || process.env.PORT;
const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/auth", authRoute);
app.use("/otp", otpService);
app.get("/", (req, res) => {
  res.send("<h1>Hello</h1>");
});

app.listen(PORT, () => {
  console.log(`Server Listening on PORT ${PORT}`);
});
