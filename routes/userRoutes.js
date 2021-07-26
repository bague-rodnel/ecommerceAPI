const express = require("express");
const router = express.Router(); 
const userController = require("../controllers/userController");
const auth = require("../auth");

router.get("/all", auth.verify, auth.requireAdmin, userController.getAllUsers);

router.get("/:userID", auth.verify, auth.requireAdmin, userController.getUserByID);
router.put("/:userID", auth.verify, auth.requireAdmin, userController.updateUserByID);

router.get("/me", auth.verify, userController.getLoggedUserInfo);
router.put("/me", auth.verify, userController.getLoggedUserInfo);
router.post("/login", userController.loginUser);
router.post("/register", userController.registerUser);

module.exports = router;

/* 
  get /me ,logged in user 
  get /:userID, admin only
*/