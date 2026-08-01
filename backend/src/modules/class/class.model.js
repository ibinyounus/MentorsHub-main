const mongoose = require("mongoose");

// --- Batch Schema ---
const batchSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        batchId: { type: String, required: true, unique: true, uppercase: true },
        comment: { type: String },
        students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }], // Assigned students
    },
    { timestamps: true }
);

// --- Course Schema ---
const courseSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        courseId: { type: String, required: true, unique: true, uppercase: true },
        comment: { type: String },
        batch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Batch",
            required: true,
        },
        teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }, // Assigned Teacher
    },
    { timestamps: true }
);

// --- Test Schema ---
const testSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        date: { type: Date, required: true },
        comment: { type: String },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        totalMarks: { type: Number, default: 100 },
    },
    { timestamps: true }
);

// --- Result (Marks) Schema ---
const resultSchema = new mongoose.Schema(
    {
        test: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Test",
            required: true,
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        marks: { type: Number, required: true },
    },
    { timestamps: true }
);

// Compound index to ensure one result per student per test
resultSchema.index({ test: 1, student: 1 }, { unique: true });

// --- Notice Schema ---
const noticeSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        date: { type: Date, default: Date.now },
        batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
    },
    { timestamps: true }
);

// --- Teacher Class Payment Schema ---
// Stores per-teacher class-related payment records
const teacherClassPaymentSchema = new mongoose.Schema(
    {
        teacherId: {
            type: String,
            required: true,
            uppercase: true, // keep consistent with Teacher.teacherId style
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        date: {
            type: Date,
            required: true,
        },
        comment: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

// Index for fast history queries by teacher
teacherClassPaymentSchema.index({ teacherId: 1, date: -1 });

exports.Batch = mongoose.model("Batch", batchSchema);
exports.Course = mongoose.model("Course", courseSchema);
exports.Test = mongoose.model("Test", testSchema);
exports.Result = mongoose.model("Result", resultSchema);
exports.Notice = mongoose.model("Notice", noticeSchema);
exports.TeacherClassPayment = mongoose.model(
    "TeacherClassPayment",
    teacherClassPaymentSchema
);
