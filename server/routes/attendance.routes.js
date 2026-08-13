const express = require("express");

const {
    markAttendance,
    getStudentAttendance,
} = require("../controllers/attendance.controller");

const {
    authenticate,
    authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("teacher", "admin"),
    markAttendance
);

router.get(
    "/student/:studentId",
    authenticate,
    authorize("student", "teacher", "admin"),
    getStudentAttendance
);

module.exports = router;