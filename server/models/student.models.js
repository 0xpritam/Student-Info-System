const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        studentId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        department: {
            type: String,
            required: true,
            trim: true,
        },

        semester: {
            type: Number,
            required: true,
            min: 1,
            max: 8,
        },

        phone: {
            type: String,
            trim: true,
        },

        dateOfBirth: {
            type: Date,
        },

        address: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Student", studentSchema);