const express = require("express");
const router = express.Router(); 
const orderController = require("../controllers/orderController");
const auth = require("../auth");

//- Retrieve all orders (Admin only)
router.get("/", auth.verify, auth.requireAdmin, orderController.getAllOrders);

// rerouted to user/myOrders
// router.get("/mine", auth.verify, orderController.getLoggedUserOrders);  

// rerouted to user/checkout
// router.post("/create", auth.verify, auth.requireNonAdmin, orderController.createOrder);

// this now serves as a helper route to get order details of a loggeduser
// since /users/:orderID is admin only as per requirements
router.get("/:orderID", auth.verify, orderController.getOrderDetails);
router.delete("/:orderID", auth.verify, orderController.deleteOrder);


module.exports = router;

/*

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