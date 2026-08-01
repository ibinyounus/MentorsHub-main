const express = require("express");
const router = express.Router();
const studentController = require("./student.controller");

router.post("/login", studentController.studentLogin);
router.post("/", studentController.createStudent);
router.get("/search", studentController.searchStudents);
router.get("/:id", studentController.getStudentById);
router.put("/:id", studentController.updateStudent);

module.exports = router;
