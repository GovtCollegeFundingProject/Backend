const express = require("express");
const router = express.Router();
const { verifyAdminRole } = require("../middlewares/admin");
const { adminlogin, getAdminPanelData } = require("../controllers/admin");
router.post("/login", adminlogin);
router.get("/admin-panel", verifyAdminRole, getAdminPanelData);
module.exports = router;
