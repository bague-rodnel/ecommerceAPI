const express = require("express");
const router = express.Router(); 
const userController = require("../controllers/userController");
const auth = require("../auth");

router.get("/", auth.verify, auth.requireAdmin, userController.getAllUsers);
router.get("/me", auth.verify, userController.getLoggedUserInfo);
router.put("/me", auth.verify, userController.updateLoggedUserInfo);

router.post("/login", userController.loginUser);
router.post("/register", userController.registerUser);

// Create Order (NON-admin only) router.post("/checkout"...
//   1. An authenticated NON-admin user sends a POST request containing a JWT in its header to the /users/checkout endpoint.
//   2. API validates user identity via JWT, returns false if validation fails.
//   3. If validation successful, API creates order using the contents of the request body.
router.post("/checkout", auth.verify, auth.requireNonAdmin, userController.userCheckout);

// Retrieve Authenticated User's Orders (NON-admin only) router.get("/myOrders"...
//   1. A GET request containing a JWT in its header is sent to the /users/myOrders endpoint.
//   2. API validates user is NOT an admin via JWT, returns false if validation fails.
//   3. If validation is successful, API retrieves orders belonging to authenticated user and returns them in its response.
router.get("/myOrders", auth.verify, auth.requireNonAdmin, userController.getLoggedUserOrders);

// Retrieve All Orders (admin only) router.get("/orders"...
//   1. A GET request containing a JWT in its header is sent to the /users/orders endpoint.
//   2. API validates user is an admin via JWT, returns false if validation fails.
//   3. If validation is successful, API retrieves all orders and returns them in its response.
router.get("/orders", auth.verify, auth.requireAdmin, userController.getAllOrders);

router.get("/:userID", auth.verify, auth.requireAdmin, userController.getUserByID);
router.put("/:userID", auth.verify, auth.requireAdmin, userController.updateUserByID);
router.delete("/:userID/", auth.verify, auth.requireAdmin, userController.deleteUser);

// Sample Workflow of User as Admin router.put("/:userID/setAsAdmin"...
//   1. An authenticated admin user sends a PUT request containing a JWT in its header to the /:userId/setAsAdmin endpoint.
//   2. API validates JWT, returns false if validation fails.
//   3. If validation successful, API finds user with ID matching the userId URL parameter and sets its isAdmin property to true.
router.put("/:userID/setAsAdmin", auth.verify, auth.requireAdmin, userController.setAsAdmin);
router.put("/:userID/setAsNonAdmin", auth.verify, auth.requireAdmin, userController.setAsNonAdmin);



module.exports = router;

//version 2 coming

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
