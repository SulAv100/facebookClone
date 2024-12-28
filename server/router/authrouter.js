const express = require("express");
const router = express.Router();
const authController = require("../controllers/authcontroller.js");
const authMiddleware = require("../middleware/authmiddleware.js");
const uploads = require("../middleware/multerConfig.js")

router.route("/signup").post(authController.register);
router.route("/login").post(authController.login);
router.route("/verifyUser").get(authMiddleware, authController.verifyUser);
// router.route("/getUsers").post(authController.getUsers);
router.route("/logoutUser").post(authController.logout);
router.route("/posts").post( uploads.single("fileData"), authController.posting);
router.route("/getUserPosts").post(authController.getRelatedPosts);

module.exports = router;
