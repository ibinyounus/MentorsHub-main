const express = require("express");
const adminRoutes = require("../modules/admin/admin.route.js");
const studentRoutes = require("../modules/student/student.route.js");
const teacherRoutes = require("../modules/teacher/teacher.route.js");
const attendanceRoutes = require("../modules/attendance/attendance.route.js");
const paymentRoutes = require("../modules/payment/payment.route.js");
const classRoutes = require("../modules/class/class.route.js");

const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/students", studentRoutes);
router.use("/teachers", teacherRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/payments", paymentRoutes);
router.use("/class", classRoutes);

module.exports = router;
