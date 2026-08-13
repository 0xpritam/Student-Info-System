const express = require("express");

const {
    createCourse,
    getCourses,
} = require("../controllers/course.controller");

const {
    authenticate,
    authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("admin"),
    createCourse
);

router.get(
    "/",
    authenticate,
    authorize("admin", "teacher", "student"),
    getCourses
);

module.exports = router;