const Attendance = require("./attendance.model");
const Student = require("../student/student.model");
const Teacher = require("../teacher/teacher.model");

exports.markAttendance = async (req, res) => {
    try {
        const { userId, userType, status, date } = req.body;

        // Validate if user exists
        let user;
        if (userType === "student") {
            user = await Student.findOne({ studentId: userId });
        } else {
            user = await Teacher.findOne({ teacherId: userId });
        }

        if (!user) {
            return res.status(404).json({ message: "User ID not found in database" });
        }

        // Normalize date to midnight to avoid time issues
        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        // Upsert: Update if exists (e.g. changing absent to present), otherwise insert
        const record = await Attendance.findOneAndUpdate(
            { userId, date: attendanceDate },
            { userId, userType, date: attendanceDate, status },
            { new: true, upsert: true }
        );

        res.status(200).json({ message: "Attendance marked successfully", record });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getAttendanceHistory = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const records = await Attendance.find({ userId }).sort({ date: -1 });

        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getTodayAttendance = async (req, res) => {
    try {
        const { userType } = req.query;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const matchQuery = { date: today };
        if (userType) matchQuery.userType = userType;

        const records = await Attendance.find(matchQuery).sort({ createdAt: -1 });

        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
