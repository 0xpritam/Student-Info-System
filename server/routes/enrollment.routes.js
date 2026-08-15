const express = require("express");

const {
    enrollStudent,
    getMyStudents,
    getMyCourses,
} = require("../controllers/enrollment.controller");

const {
    authenticate,
    authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("admin"),
    enrollStudent
);
router.get(
    "/teacher/me",
    authenticate,
    authorize("teacher"),
    getMyStudents
);
router.get(
    "/student/me",
    authenticate,
    authorize("student"),
    getMyCourses
);
module.exports = router;