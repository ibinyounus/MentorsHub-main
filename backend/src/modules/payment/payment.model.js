const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
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
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        comment: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

// Index for searching payments by user
paymentSchema.index({ userId: 1 });

module.exports = mongoose.model("Payment", paymentSchema);
