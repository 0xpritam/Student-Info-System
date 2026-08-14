const Enrollment = require("../models/enrollment.models");
const Student = require("../models/student.models");
const Course = require("../models/course.models");
const Teacher = require("../models/teacher.models");

const enrollStudent = async (req, res) => {
    try {
        const { studentId, courseId } = req.body;

        if (!studentId || !courseId) {
            return res.status(400).json({
                message: "Student ID and course ID are required",
            });
        }

        // Check student exists
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        // Check course exists
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found",
            });
        }

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({
            studentId,
            courseId,
        });

        if (existingEnrollment) {
            return res.status(409).json({
                message: "Student already enrolled in this course",
            });
        }

        const enrollment = await Enrollment.create({
            studentId,
            courseId,
        });

        res.status(201).json({
            message: "Student enrolled successfully",
            enrollment,
        });
    } catch (error) {
        console.error("Enroll student error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};
const getMyStudents = async (req, res) => {
    try {
        const teacher = await Teacher.findOne({
            userId: req.user.userId,
        });

        if (!teacher) {
            return res.status(404).json({
                message: "Teacher profile not found",
            });
        }

        const courses = await Course.find({
            teacherId: teacher._id,
        }).select("_id");

        const courseIds = courses.map((course) => course._id);

        const enrollments = await Enrollment.find({
            courseId: { $in: courseIds },
        })
            .populate({
                path: "studentId",
                populate: {
                    path: "userId",
                    select: "name email",
                },
            })
            .populate(
                "courseId",
                "courseCode courseName"
            );

        res.status(200).json({
            students: enrollments,
        });
    } catch (error) {
        console.error("Get teacher students error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

module.exports = {
    enrollStudent,
    getMyStudents,
};