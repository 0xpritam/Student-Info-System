const express = require("express");
const { authenticate, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/admin", authenticate, authorize("admin"), (req, res) => {
    res.json({
        message: "Admin route accessed successfully",
        user: req.user,
    });
});

module.exports = router;