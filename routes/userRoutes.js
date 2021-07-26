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

DATA MODEL DESIGN


--- E-commerce API MVP requirements ---
 - User registration
 - User authentication
 - Set user as admin (Admin only)

 - Retrieve all active products
 - Retrieve single product
- Create Product (Admin only)
- Update Product information (Admin only)
- Archive Product (Admin only)

- Non-admin User checkout (Create Order)
- Retrieve authenticated user’s orders
- Retrieve all orders (Admin only)


*/
