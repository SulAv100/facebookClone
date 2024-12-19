const express = require("express");
const router = express.Router();
const authController = require("../controllers/authcontroller.js");

router.route("/signup").post(authController.register);
router.route("/login").post(authController.login)

module.exports = router;
