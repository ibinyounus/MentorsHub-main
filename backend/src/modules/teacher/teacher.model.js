const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    teacherId: {
      type: String,
      required: true,
      unique: true, // login ID
      uppercase: true,
    },

    mobile1: {
      type: String,
      required: true,
    },

    mobile2: {
      type: String,
    },

    institution: {
      type: String,
    },

    address: {
      type: String,
    },

    password: {
      type: String,
      required: true, // hashed
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
      default: "teacher",
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);
