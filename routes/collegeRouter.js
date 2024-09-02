const express = require("express");
const router = express.Router();
const { getColleges } = require("../controllers/collegeController");
const { extractEmailFromToken } = require("../middlewares/email");

router.get("/getColleges", extractEmailFromToken, getColleges);

module.exports = router;
