const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
