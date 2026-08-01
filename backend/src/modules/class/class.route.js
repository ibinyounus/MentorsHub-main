const express = require("express");
const router = express.Router();
const classController = require("./class.controller");

// Batch
router.post("/batches", classController.createBatch);
router.get("/batches", classController.getAllBatches);
router.get("/batches/:id", classController.getBatchById);
router.post("/batches/:batchId/students", classController.addStudentsToBatch);
router.delete("/batches/:id", classController.deleteBatch);

// Course
router.post("/courses", classController.createCourse);
router.get("/courses/batch/:batchId", classController.getCoursesByBatch);
router.get("/courses/teacher/:teacherId", classController.getCoursesByTeacher);
router.get("/courses/:id", classController.getCourseById);
router.put("/courses/:id", classController.updateCourse);
router.delete("/courses/:id", classController.deleteCourse);

// Test
router.post("/tests", classController.createTest);
router.get("/tests/course/:courseId", classController.getTestsByCourse);
router.get("/tests/:id", classController.getTestById);
router.put("/tests/:id", classController.updateTest);
router.delete("/tests/:id", classController.deleteTest);

// Marks
router.post("/marks", classController.updateMarks);
router.get("/results/student/:studentId", classController.getResultsByStudentId);

// Notices
router.post("/notices", classController.createNotice);
router.get("/notices/batch/:batchId", classController.getNoticesByBatch);
router.put("/notices/:id", classController.updateNotice);
router.delete("/notices/:id", classController.deleteNotice);
router.get("/notices/student/:studentId", classController.getNoticesByStudentId);

// Teacher Class Management (per-teacher class payment/history)
router.post("/teacher-class", classController.addTeacherClassPayment);
router.get("/teacher-class/history", classController.getTeacherClassHistory);
router.delete("/teacher-class/:id", classController.deleteTeacherClassRecord);

module.exports = router;
