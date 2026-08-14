const Teacher = require("../models/teacher.models");
const User = require("../models/user.models");
const bcrypt = require("bcryptjs");

const createTeacher = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            teacherId,
            department,
            subject,
            phone,
        } = req.body;

        if (!name || !email || !password || !teacherId || !department || !subject) {
            return res.status(400).json({
                message: "Required fields are missing",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists",
            });
        }

        const existingTeacher = await Teacher.findOne({ teacherId });

        if (existingTeacher) {
            return res.status(409).json({
                message: "Teacher ID already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "teacher",
        });

        const teacher = await Teacher.create({
            userId: user._id,
            teacherId,
            department,
            subject,
            phone,
        });

        res.status(201).json({
            message: "Teacher created successfully",
            teacher,
        });
    } catch (error) {
        console.error("Create teacher error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

const getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find()
            .populate("userId", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            teachers,
        });
    } catch (error) {
        console.error("Get teachers error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};
const getMyTeacherProfile = async (req, res) => {
    try {
        const teacher = await Teacher.findOne({
            userId: req.user.userId,
        }).populate("userId", "name email");

        if (!teacher) {
            return res.status(404).json({
                message: "Teacher profile not found",
            });
        }

        res.status(200).json({
            teacher,
        });
    } catch (error) {
        console.error("Get teacher profile error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

module.exports = {
    createTeacher,
    getTeachers,
    getMyTeacherProfile,
};