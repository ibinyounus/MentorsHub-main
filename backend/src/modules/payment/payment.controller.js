const Payment = require("./payment.model");
const Student = require("../student/student.model");
const Teacher = require("../teacher/teacher.model");

exports.addPayment = async (req, res) => {
    try {
        const { userId, userType, amount, date, comment } = req.body;

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

        const newPayment = new Payment({
            userId,
            userType,
            date: new Date(date),
            amount,
            comment,
        });

        await newPayment.save();

        res.status(201).json({ message: "Payment added successfully", payment: newPayment });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getPaymentHistory = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const records = await Payment.find({ userId }).sort({ date: -1 });

        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Summary for current and previous month by userType
exports.getPaymentSummary = async (req, res) => {
    try {
        const { userType } = req.query; // 'student' or 'teacher'

        if (!userType || !["student", "teacher"].includes(userType)) {
            return res
                .status(400)
                .json({ message: "Valid userType (student or teacher) is required" });
        }

        const now = new Date();

        // Current month range
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthEnd = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
            23,
            59,
            59,
            999
        );

        // Previous month range
        const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevMonthEnd = new Date(
            now.getFullYear(),
            now.getMonth(),
            0,
            23,
            59,
            59,
            999
        );

        const [currentAgg, prevAgg] = await Promise.all([
            Payment.aggregate([
                {
                    $match: {
                        userType,
                        date: { $gte: currentMonthStart, $lte: currentMonthEnd },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: "$amount" },
                        count: { $sum: 1 },
                    },
                },
            ]),
            Payment.aggregate([
                {
                    $match: {
                        userType,
                        date: { $gte: prevMonthStart, $lte: prevMonthEnd },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: "$amount" },
                        count: { $sum: 1 },
                    },
                },
            ]),
        ]);

        const currentSummary = currentAgg[0] || { totalAmount: 0, count: 0 };
        const prevSummary = prevAgg[0] || { totalAmount: 0, count: 0 };

        res.status(200).json({
            userType,
            currentMonth: {
                totalAmount: currentSummary.totalAmount,
                count: currentSummary.count,
                start: currentMonthStart,
                end: currentMonthEnd,
            },
            previousMonth: {
                totalAmount: prevSummary.totalAmount,
                count: prevSummary.count,
                start: prevMonthStart,
                end: prevMonthEnd,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
