const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            uppercase: true, // stores studentId or teacherId
        },
        userType: {
            type: String,
            enum: ["student", "teacher"],
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["present", "absent"],
            default: "present",
        },
    },
    { timestamps: true }
);

// TTL Index: Expire after 35 days (35 * 24 * 60 * 60 seconds)
// Note: The expiry happens based on the 'date' field.
attendanceSchema.index({ date: 1 }, { expireAfterSeconds: 3024000 });

// Compound index to ensure one record per user per day
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
