const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
const express = require("express");
const adminRoute = require("./routes/admin");
const authRoute = require("./routes/auth");
const otpService = require("./routes/otp");
const userRoute = require("./routes/user");
const collegeRouter = require("./routes/collegeRouter");
const PORT = process.env.PORTT || 3000;
const app = express();
const allowedDomain = process.env.CLIENT_URL || "http://localhost:5173";

const corsOptions = {
  origin: allowedDomain,
  optionsSuccessStatus: 200,
  credentials: true,
};
console.log(allowedDomain);

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
// app.use(cors());
app.use("/admin", adminRoute);
app.use("/auth", authRoute);
app.use("/otp", otpService);
app.use("/user", userRoute);
app.use("/college", collegeRouter);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 500;
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
app.get("/", (req, res) => {
  res.send("<h1>Hello</h1>");
});

app.listen(PORT, () => {
  console.log(`Server Listening on PORT ${PORT}`);
});
