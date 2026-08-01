const Teacher = require("./teacher.model");
const { hashPassword, comparePassword } = require("../../utils/hashPassword");
const {
    generateAccessToken,
    generateRefreshToken,
} = require("../../utils/generateToken");


exports.teacherLogin = async (req, res) => {
    try {
        const { teacherId, password } = req.body;

        const teacher = await Teacher.findOne({ teacherId });
        if (!teacher) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await comparePassword(password, teacher.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const payload = { id: teacher._id, role: "teacher" };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        teacher.refreshToken = refreshToken;
        await teacher.save();

        res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            role: "teacher",
            teacherId: teacher.teacherId,
            name: teacher.name,
            institution: teacher.institution
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.createTeacher = async (req, res) => {
    try {
        const {
            name,
            teacherId,
            mobile1,
            mobile2,
            institution,
            address,
            password,
            branches,
        } = req.body;

        // Check if teacherId already exists
        const existingTeacher = await Teacher.findOne({ teacherId });
        if (existingTeacher) {
            return res.status(400).json({ message: "Teacher ID already exists" });
        }

        const hashedPassword = await hashPassword(password);

        const newTeacher = new Teacher({
            name,
            teacherId,
            mobile1,
            mobile2,
            institution,
            address,
            password: hashedPassword,
            branches,
        });

        await newTeacher.save();

        res
            .status(201)
            .json({ message: "Teacher created successfully", teacher: newTeacher });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.searchTeachers = async (req, res) => {
    try {
        const { term } = req.query;

        if (!term) {
            return res.status(400).json({ message: "Search term is required" });
        }

        const teachers = await Teacher.find({
            $or: [
                { teacherId: { $regex: term, $options: "i" } },
                { name: { $regex: term, $options: "i" } },
            ],
        }).select("-password");

        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getTeacherById = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await Teacher.findById(id).select("-password");

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        res.status(200).json(teacher);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (updates.password) {
            updates.password = await hashPassword(updates.password);
        }

        const teacher = await Teacher.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        }).select("-password");

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        res.status(200).json({ message: "Teacher updated successfully", teacher });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
