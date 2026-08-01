const Student = require("./student.model");
const { hashPassword, comparePassword } = require("../../utils/hashPassword");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/generateToken");


exports.studentLogin = async (req, res) => {
  try {
    const { studentId, password } = req.body;

    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { id: student._id, role: "student" };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    student.refreshToken = refreshToken;
    await student.save();

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      role: "student",
      studentId: student.studentId,
      name: student.name,
      institution: student.institution
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      motherName,
      institution,
      class: studentClass,
      studentId,
      password,
      mobile,
      address,
      branches,
    } = req.body;

    // Check if studentId already exists
    const existingStudent = await Student.findOne({ studentId });
    if (existingStudent) {
      return res.status(400).json({ message: "Student ID already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const newStudent = new Student({
      name,
      fatherName,
      motherName,
      institution,
      class: studentClass,
      studentId,
      password: hashedPassword,
      mobile,
      address,
      branches,
    });

    await newStudent.save();

    res
      .status(201)
      .json({ message: "Student created successfully", student: newStudent });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.searchStudents = async (req, res) => {
  try {
    const { term } = req.query; // Search term (studentId)

    if (!term) {
      return res.status(400).json({ message: "Search term is required" });
    }

    // Find students whose studentId OR name contains the search term (case-insensitive)
    const students = await Student.find({
      $or: [
        { studentId: { $regex: term, $options: "i" } },
        { name: { $regex: term, $options: "i" } },
      ],
    }).select("-password"); // Exclude password

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params; // This is the Database _id
    const student = await Student.findById(id).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If password is being updated, hash it
    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }

    const student = await Student.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student updated successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
