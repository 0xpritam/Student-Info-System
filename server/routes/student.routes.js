const express = require("express");

const {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    getMyStudentProfile,
} = require("../controllers/student.controller");

const { authenticate, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("admin"),
    createStudent
);

router.get(
    "/",
    authenticate,
    authorize("admin", "teacher"),
    getStudents
);
router.get(
    "/me",
    authenticate,
    authorize("student"),
    getMyStudentProfile
);
router.get(
    "/:id",
    authenticate,
    authorize("admin", "teacher", "student"),
    getStudentById
);

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    deleteStudent
);
router.put(
    "/:id",
    authenticate,
    authorize("admin"),
    updateStudent
);

module.exports = router;    