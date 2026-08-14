const express = require("express");

const {
    enrollStudent,
    getMyStudents,
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
module.exports = router;