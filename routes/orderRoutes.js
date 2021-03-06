const express = require("express");
const router = express.Router(); 
const orderController = require("../controllers/orderController");
const auth = require("../middlewares/auth");

//- Retrieve all orders (Admin only)
router.get("/", auth.verify, auth.requireAdmin, orderController.getAllOrders);

// rerouted to user/myOrders
// router.get("/mine", auth.verify, orderController.getLoggedUserOrders);  

// rerouted to user/checkout
// router.post("/checkout", auth.verify, auth.requireNonAdmin, orderController.createOrder);

// for debuggin new code
router.put("/runcode", orderController.runCode);
router.get("/:orderID", auth.verify, auth.requireAdmin, orderController.getOrderDetails);
router.delete("/:orderID", auth.verify, auth.requireAdmin, orderController.deleteOrder);


module.exports = router;
