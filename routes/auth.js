const express = require("express");
const {
  registerIndividual,
  login,
  registerCompany,
} = require("../controllers/auth");
const router = express.Router();

router.post("/registerIndividual", registerIndividual);
router.post("/registerCompany", registerCompany);
router.post("/login", login);

module.exports = router;
