const Course = require("../models/course.models");

const createCourse = async (req, res) => {
    try {
        const {
            courseCode,
            courseName,
            department,
            semester,
            teacherId,
            credits,
        } = req.body;

        if (
            !courseCode ||
            !courseName ||
            !department ||
            !semester ||
            !teacherId ||
            !credits
        ) {
            return res.status(400).json({
                message: "Required fields are missing",
            });
        }

        const existingCourse = await Course.findOne({ courseCode });

        if (existingCourse) {
            return res.status(409).json({
                message: "Course code already exists",
            });
        }

        const course = await Course.create({
            courseCode,
            courseName,
            department,
            semester,
            teacherId,
            credits,
        });

        res.status(201).json({
            message: "Course created successfully",
            course,
        });
    } catch (error) {
        console.error("Create course error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

const getCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate({
                path: "teacherId",
                populate: {
                    path: "userId",
                    select: "name email",
                },
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            courses,
        });
    } catch (error) {
        console.error("Get courses error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

module.exports = {
    createCourse,
    getCourses,
};