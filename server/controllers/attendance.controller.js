const Attendance = require("../models/attendance.models");

const markAttendance = async (req, res) => {
    try {
        const { studentId, courseId, date, status } = req.body;

        if (!studentId || !courseId || !date || !status) {
            return res.status(400).json({
                message: "Required fields are missing",
            });
        }

        const attendance = await Attendance.create({
            studentId,
            courseId,
            date,
            status,
        });

        res.status(201).json({
            message: "Attendance marked successfully",
            attendance,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Attendance already marked for this date",
            });
        }

        console.error("Mark attendance error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

const getStudentAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({
            studentId: req.params.studentId,
        })
            .populate("courseId", "courseCode courseName")
            .sort({ date: -1 });

        res.status(200).json({
            attendance,
        });
    } catch (error) {
        console.error("Get attendance error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};
const getAllAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find()
            .populate("courseId", "courseCode courseName")
            .sort({ date: -1 });

        res.status(200).json({
            attendance,
        });
    } catch (error) {
        console.error("Get all attendance error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

module.exports = {
    markAttendance,
    getStudentAttendance,
    getAllAttendance,
};