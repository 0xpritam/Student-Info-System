const Student = require("../models/student.models");
const User = require("../models/user.models");

const createStudent = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            studentId,
            department,
            semester,
            phone,
            dateOfBirth,
            address,
        } = req.body;

        if (!name || !email || !password || !studentId || !department || !semester) {
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

        const existingStudent = await Student.findOne({ studentId });

        if (existingStudent) {
            return res.status(409).json({
                message: "Student ID already exists",
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: "student",
        });

        const student = await Student.create({
            userId: user._id,
            studentId,
            department,
            semester,
            phone,
            dateOfBirth,
            address,
        });

        res.status(201).json({
            message: "Student created successfully",
            student,
        });
    } catch (error) {
        console.error("Create student error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

const getStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .populate("userId", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            students,
        });
    } catch (error) {
        console.error("Get students error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .populate("userId", "name email");

        if (!student) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        res.status(200).json({
            student,
        });
    } catch (error) {
        console.error("Get student error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        await User.findByIdAndDelete(student.userId);
        await Student.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Student deleted successfully",
        });
    } catch (error) {
        console.error("Delete student error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

const updateStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        const {
            name,
            email,
            department,
            semester,
            phone,
            dateOfBirth,
            address,
        } = req.body;

        const user = await User.findById(student.userId);

        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();

        if (department) student.department = department;
        if (semester) student.semester = semester;
        if (phone) student.phone = phone;
        if (dateOfBirth) student.dateOfBirth = dateOfBirth;
        if (address) student.address = address;

        await student.save();

        res.status(200).json({
            message: "Student updated successfully",
            student,
        });
    } catch (error) {
        console.error("Update student error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};
module.exports = {
    createStudent,
    getStudents,
    getStudentById,
    deleteStudent,
    updateStudent,
};