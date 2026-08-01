require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../modules/admin/admin.model");
const { hashPassword } = require("../utils/hashPassword");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected");

    const email = "mentorsHub@gmail.com";
    const password = "test@123mh";

    const exists = await Admin.findOne({ email });
    if (exists) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await hashPassword(password);

    await Admin.create({
      email,
      password: hashedPassword,
    });

    console.log("Admin created successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
