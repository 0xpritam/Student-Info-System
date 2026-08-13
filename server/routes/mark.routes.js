const express = require("express");

const {
    addMark,
    getStudentMarks,
} = require("../controllers/mark.controller");

const {
    authenticate,
    authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("teacher", "admin"),
    addMark
);

router.get(
    "/student/:studentId",
    authenticate,
    authorize("student", "teacher", "admin"),
    getStudentMarks
);

module.exports = router;