const express = require("express");
const router = express.Router(); 
const orderController = require("../controllers/orderController");
const auth = require("../auth");

router.get("/all", auth.verify, auth.requireAdmin, orderController.getAllOrders);
router.get("/mine", auth.verify, orderController.getLoggedUserOrders); 
router.post("/create", auth.verify, orderController.createOrder);
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