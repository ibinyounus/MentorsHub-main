const express = require("express");
const router = express.Router();
const teacherController = require("./teacher.controller");

router.post("/login", teacherController.teacherLogin);
router.post("/", teacherController.createTeacher);
router.get("/search", teacherController.searchTeachers);
router.get("/:id", teacherController.getTeacherById);
router.put("/:id", teacherController.updateTeacher);

module.exports = router;
