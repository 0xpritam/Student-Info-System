const Mark = require("../models/mark.models");

const addMark = async (req, res) => {
    try {
        const {
            studentId,
            courseId,
            examType,
            marks,
        } = req.body;

        if (!studentId || !courseId || !examType || marks === undefined) {
            return res.status(400).json({
                message: "Required fields are missing",
            });
        }

        const mark = await Mark.create({
            studentId,
            courseId,
            examType,
            marks,
        });

        res.status(201).json({
            message: "Marks added successfully",
            mark,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Marks already added for this exam",
            });
        }

        console.error("Add marks error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

const getStudentMarks = async (req, res) => {
    try {
        const marks = await Mark.find({
            studentId: req.params.studentId,
        })
            .populate("courseId", "courseCode courseName")
            .sort({ createdAt: -1 });

        res.status(200).json({
            marks,
        });
    } catch (error) {
        console.error("Get marks error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

module.exports = {
    addMark,
    getStudentMarks,
};