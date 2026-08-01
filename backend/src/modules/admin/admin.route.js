const express = require("express");
const { adminLogin, adminLogout } = require("./admin.controller");
const { protect } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.post("/login", adminLogin);
router.post("/logout", protect, adminLogout); // Assuming 'protect' middleware adds req.user
module.exports = router;
