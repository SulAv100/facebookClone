const express = require("express");
const router = express.Router();
const authController = require("../controllers/authcontroller.js");
const authMiddleware = require("../middleware/authmiddleware.js");

router.route("/signup").post(authController.register);
router.route("/login").post(authController.login);
router.route("/verifyUser").get(authMiddleware, authController.verifyUser);

module.exports = router;
