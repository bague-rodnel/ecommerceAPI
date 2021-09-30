const express = require("express");
const router = express.Router(); 
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");

router.get("/", auth.verify, auth.requireAdmin, userController.getAllUsers);
router.get("/me", auth.verify, userController.getLoggedUserInfo);
router.put("/me", auth.verify, userController.updateLoggedUserInfo);

router.post("/login", userController.loginUser);
router.post("/register", userController.registerUser);
router.get("/logout", userController.logout);
router.post("/password/forgot", userController.forgotPassword);
router.put("/password/update", auth.verify, userController.updatePassword);
router.put("/password/reset/:token", userController.resetPassword);

router.post("/checkout", auth.verify, auth.requireNonAdmin, userController.userCheckout);
router.get("/myOrders", auth.verify, auth.requireNonAdmin, userController.getLoggedUserOrders);
router.get("/orders", auth.verify, auth.requireAdmin, userController.getAllOrders);
router.get("/:userID", auth.verify, auth.requireAdmin, userController.getUserByID);
router.put("/:userID", auth.verify, auth.requireAdmin, userController.updateUserByID);
router.delete("/:userID/", auth.verify, auth.requireAdmin, userController.deleteUser);
router.put("/:userID/setAsAdmin", auth.verify, auth.requireAdmin, userController.setAsAdmin);
router.put("/:userID/setAsNonAdmin", auth.verify, auth.requireAdmin, userController.setAsNonAdmin);


// Create Order (NON-admin only) router.post("/checkout"...
//   1. An authenticated NON-admin user sends a POST request containing a JWT in its header to the /users/checkout endpoint.
//   2. API validates user identity via JWT, returns false if validation fails.
//   3. If validation successful, API creates order using the contents of the request body.

// Retrieve Authenticated User's Orders (NON-admin only) router.get("/myOrders"...
//   1. A GET request containing a JWT in its header is sent to the /users/myOrders endpoint.
//   2. API validates user is NOT an admin via JWT, returns false if validation fails.
//   3. If validation is successful, API retrieves orders belonging to authenticated user and returns them in its response.

// Retrieve All Orders (admin only) router.get("/orders"...
//   1. A GET request containing a JWT in its header is sent to the /users/orders endpoint.
//   2. API validates user is an admin via JWT, returns false if validation fails.
//   3. If validation is successful, API retrieves all orders and returns them in its response.

// Sample Workflow of User as Admin router.put("/:userID/setAsAdmin"...
//   1. An authenticated admin user sends a PUT request containing a JWT in its header to the /:userId/setAsAdmin endpoint.
//   2. API validates JWT, returns false if validation fails.
//   3. If validation successful, API finds user with ID matching the userId URL parameter and sets its isAdmin property to true.

module.exports = router;