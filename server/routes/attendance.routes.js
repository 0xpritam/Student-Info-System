const express = require("express");

const {
    markAttendance,
    getStudentAttendance,
     getAllAttendance,
     getMyAttendance,
} = require("../controllers/attendance.controller");

const {
    authenticate,
    authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("teacher"),
    markAttendance
);
router.get(
    "/",
    authenticate,
    authorize("teacher", "admin"),
    getAllAttendance
);
router.get(
    "/student/me",
    authenticate,
    authorize("student"),
    getMyAttendance
);
router.get(
    "/student/:studentId",
    authenticate,
    authorize("student", "teacher", "admin"),
    getStudentAttendance
);

module.exports = router;