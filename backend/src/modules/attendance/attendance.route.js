const express = require("express");
const router = express.Router();
const attendanceController = require("./attendance.controller");

router.post("/", attendanceController.markAttendance);
router.get("/history", attendanceController.getAttendanceHistory);
router.get("/today", attendanceController.getTodayAttendance);

module.exports = router;
