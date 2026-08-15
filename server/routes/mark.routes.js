const express = require("express");

const {
    addMark,
    getStudentMarks,
    getAllMarks,
        getMyMarks,

} = require("../controllers/mark.controller");

const {
    authenticate,
    authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("teacher"),
    addMark
);
router.get(
    "/",
    authenticate,
    authorize("teacher", "admin"),
    getAllMarks
);
router.get(
    "/student/me",
    authenticate,
    authorize("student"),
    getMyMarks
);
router.get(
    "/student/:studentId",
    authenticate,
    authorize("student", "teacher", "admin"),
    getStudentMarks
);


module.exports = router;