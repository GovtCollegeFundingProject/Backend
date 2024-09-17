const express = require("express");
const {
  registerIndividual,
  login,
  registerCompany,
  getTotalTransactionAmount,
} = require("../controllers/auth");
const router = express.Router();

router.post("/registerIndividual", registerIndividual);
router.post("/registerCompany", registerCompany);
router.post("/login", login);
router.get("/total-transaction-amount", getTotalTransactionAmount);
module.exports = router;
