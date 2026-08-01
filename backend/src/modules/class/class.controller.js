const { Batch, Course, Test, Result, Notice, TeacherClassPayment } = require("./class.model");
const Student = require("../student/student.model");
const Teacher = require("../teacher/teacher.model");

// --- Batch Controllers ---
exports.createBatch = async (req, res) => {
    try {
        const { name, batchId, comment } = req.body;
        const batch = new Batch({ name, batchId, comment });
        await batch.save();
        res.status(201).json(batch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllBatches = async (req, res) => {
    try {
        const batches = await Batch.find().sort({ createdAt: -1 });
        res.status(200).json(batches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBatchById = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id)
            .populate("students", "name studentId")
            .populate("students"); // We might need full student details? Just fields for list logic.
        if (!batch) return res.status(404).json({ message: "Batch not found" });
        res.status(200).json(batch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addStudentsToBatch = async (req, res) => {
    try {
        const { batchId } = req.params;
        const { studentIds } = req.body; // Array of DB _ids of students

        const batch = await Batch.findById(batchId);
        if (!batch) return res.status(404).json({ message: "Batch not found" });

        // Add unique students
        studentIds.forEach((sid) => {
            if (!batch.students.includes(sid)) {
                batch.students.push(sid);
            }
        });

        await batch.save();
        res.status(200).json({ message: "Students added successfully", batch });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteBatch = async (req, res) => {
    try {
        await Batch.findByIdAndDelete(req.params.id);
        // TODO: Cascade delete courses? For now, manual.
        res.status(200).json({ message: "Batch deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// --- Course Controllers ---
exports.createCourse = async (req, res) => {
    try {
        const { name, courseId, comment, batchId, teacherId } = req.body;

        // Find teacher by ID string if provided
        let teacherObjectId = null;
        if (teacherId) {
            const teacher = await Teacher.findOne({ teacherId });
            if (teacher) teacherObjectId = teacher._id;
        }

        const course = new Course({
            name,
            courseId,
            comment,
            batch: batchId,
            teacher: teacherObjectId
        });
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCoursesByBatch = async (req, res) => {
    try {
        const courses = await Course.find({ batch: req.params.batchId }).populate("teacher", "name teacherId");
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate("teacher", "name teacherId")
            .populate("batch", "name");

        if (!course) return res.status(404).json({ message: "Course not found" });

        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const { name, comment, teacherId } = req.body;
        const updates = { name, comment };

        if (teacherId) {
            const teacher = await Teacher.findOne({ teacherId });
            if (teacher) updates.teacher = teacher._id;
        } else if (teacherId === "") {
            // If expressly cleared
            updates.teacher = null;
        }

        const course = await Course.findByIdAndUpdate(req.params.id, updates, { new: true }).populate("teacher", "name teacherId");
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteCourse = async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Course deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.getCoursesByTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const teacher = await Teacher.findOne({ teacherId });
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        const courses = await Course.find({ teacher: teacher._id }).populate("batch", "name batchId");
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Test Controllers ---
exports.createTest = async (req, res) => {
    try {
        const { name, date, comment, courseId } = req.body;
        const test = new Test({ name, date, comment, course: courseId });
        await test.save();
        res.status(201).json(test);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTestsByCourse = async (req, res) => {
    try {
        const tests = await Test.find({ course: req.params.courseId }).sort({ date: -1 });
        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTestById = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id).populate("course");
        if (!test) return res.status(404).json({ message: "Test not found" });

        // Also fetch students from the batch associated with this test's course
        // Need deep populate or manual fetch.
        // Course -> Batch -> Students
        const course = await Course.findById(test.course).populate({
            path: 'batch',
            populate: { path: 'students', select: 'name studentId' }
        });

        // Fetch existing results for this test
        const results = await Result.find({ test: test._id });

        res.status(200).json({ test, students: course.batch.students, results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteTest = async (req, res) => {
    try {
        await Test.findByIdAndDelete(req.params.id);
        await Result.deleteMany({ test: req.params.id }); // Clean up results
        res.status(200).json({ message: "Test and results deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTest = async (req, res) => {
    try {
        const { id } = req.params;
        const test = await Test.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(test);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Result Controller ---
exports.updateMarks = async (req, res) => {
    try {
        const { testId, marksData } = req.body; // marksData: [{ studentId (DB _id), marks }]

        console.log("Updating marks for test:", testId);

        const operations = marksData.map((item) => ({
            updateOne: {
                filter: { test: testId, student: item.studentId },
                update: { marks: item.marks },
                upsert: true,
            },
        }));

        if (operations.length > 0) {
            await Result.bulkWrite(operations);
        }

        res.status(200).json({ message: "Marks updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Notice Controller ---
exports.createNotice = async (req, res) => {
    try {
        const { title, content, batchId } = req.body;
        const notice = new Notice({ title, content, batch: batchId });
        await notice.save();
        res.status(201).json(notice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getNoticesByBatch = async (req, res) => {
    try {
        const { batchId } = req.params;
        const notices = await Notice.find({ batch: batchId }).sort({ createdAt: -1 });
        res.status(200).json(notices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteNotice = async (req, res) => {
    try {
        await Notice.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Notice deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateNotice = async (req, res) => {
    try {
        const { id } = req.params;
        const notice = await Notice.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(notice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getResultsByStudentId = async (req, res) => {
    try {
        const { studentId } = req.params; // S_01

        // Find student MongoID
        const student = await Student.findOne({ studentId });
        if (!student) return res.status(404).json({ message: "Student not found" });

        const results = await Result.find({ student: student._id })
            .populate({
                path: 'test',
                populate: { path: 'course', select: 'name courseId' }
            })
            .sort({ createdAt: -1 });

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getNoticesByStudentId = async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findOne({ studentId });
        if (!student) return res.status(404).json({ message: "Student not found" });

        // Find batches where this student is enrolled
        const batches = await Batch.find({ students: student._id });
        const batchIds = batches.map(b => b._id);

        // Find notices for these batches
        const notices = await Notice.find({ batch: { $in: batchIds } })
            .populate("batch", "name")
            .sort({ createdAt: -1 });

        res.status(200).json(notices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Teacher Class Payment Controllers ---
// Add a new teacher class payment record
exports.addTeacherClassPayment = async (req, res) => {
    try {
        let { teacherId, amount, date, comment } = req.body;

        if (!teacherId || !amount || !date) {
            return res
                .status(400)
                .json({ message: "teacherId, amount and date are required" });
        }

        // Normalize ID to uppercase for consistency
        teacherId = teacherId.toUpperCase();

        // Ensure teacher exists
        const teacher = await Teacher.findOne({ teacherId });
        if (!teacher) {
            return res
                .status(404)
                .json({ message: "Teacher ID not found in database" });
        }

        const record = new TeacherClassPayment({
            teacherId,
            amount,
            date: new Date(date),
            comment,
        });

        await record.save();

        res
            .status(201)
            .json({ message: "Teacher class record added successfully", record });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all class payment history for a given teacher ID
exports.getTeacherClassHistory = async (req, res) => {
    try {
        let { teacherId } = req.query;

        if (!teacherId) {
            return res.status(400).json({ message: "Teacher ID is required" });
        }

        teacherId = teacherId.toUpperCase();

        const records = await TeacherClassPayment.find({ teacherId }).sort({
            date: -1,
        });

        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a specific class payment record by its MongoDB _id
exports.deleteTeacherClassRecord = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await TeacherClassPayment.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Record not found" });
        }

        res.status(200).json({ message: "Record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
