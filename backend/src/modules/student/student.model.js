const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    fatherName: {
      type: String,
      required: true,
    },

    motherName: {
      type: String,
      required: true,
    },

    institution: {
      type: String,
    },

    class: {
      type: String,
      required: true,
    },

    studentId: {
      type: String,
      required: true,
      unique: true, // login ID
      uppercase: true,
    },

    password: {
      type: String,
      required: true, // hashed
    },

    mobile: {
      type: String,
      required: true,
    },

    address: {
      type: String,
    },

    branches: [
      {
        type: String,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    role: {
      type: String,
      default: "student",
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
