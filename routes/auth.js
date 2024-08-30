const express = require("express");
const {
  registerIndividual,
  login,
  registerCompany,
  editProfile,
} = require("../controllers/auth");
const router = express.Router();
const { extractEmailFromToken } = require("../middlewares/email");

router.post("/registerIndividual", registerIndividual);
router.post("/registerCompany", registerCompany);
router.post("/login", login);
router.put("/editProfile", extractEmailFromToken, editProfile);

module.exports = router;
