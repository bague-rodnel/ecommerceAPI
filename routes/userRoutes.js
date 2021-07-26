// [NEW FILE]
const express = require("express");
const router = express.Router(); 
const userController = require("../controllers/userController");
const auth = require("../auth");

router.post("/login", userController.loginUser);
//router.post("/logout", userController.loginUser);
router.post("/register",  userController.registerUser);
router.get("/details", auth.verify, userController.getDetails);


module.exports = router;
