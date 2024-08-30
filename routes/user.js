const express = require("express");
const router = express.Router();
const { extractEmailFromToken } = require("../middlewares/email");
const { editProfile, getUserData } = require("../controllers/user");
router.put("/editProfile", extractEmailFromToken, editProfile);
router.get("/getUser", extractEmailFromToken, getUserData);
module.exports = router;
