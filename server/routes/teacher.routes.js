const express = require("express");

const {
    createTeacher,
    getTeachers,
} = require("../controllers/teacher.controller");

const {
    authenticate,
    authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("admin"),
    createTeacher
);

router.get(
    "/",
    authenticate,
    authorize("admin"),
    getTeachers
);

module.exports = router;