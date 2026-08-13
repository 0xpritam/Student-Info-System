const mongoose = require("mongoose");

const markSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },

        examType: {
            type: String,
            enum: ["midterm", "assignment", "final"],
            required: true,
        },

        marks: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
    },
    {
        timestamps: true,
    }
);

markSchema.index(
    { studentId: 1, courseId: 1, examType: 1 },
    { unique: true }
);

module.exports = mongoose.model("Mark", markSchema);