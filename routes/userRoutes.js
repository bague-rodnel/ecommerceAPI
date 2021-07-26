// [NEW FILE]
const express = require("express");
const router = express.Router(); 
const userController = require("../controllers/userController");
const auth = require("../auth");

router.get("/all", auth.verify, auth.requireAdmin, userController.getAllUsers);
router.get("/details", auth.verify, userController.getDetails);
router.post("/login", userController.loginUser);
//router.post("/logout", userController.loginUser);
router.post("/register", auth.requireAdmin, userController.registerUser);


module.exports = router;
