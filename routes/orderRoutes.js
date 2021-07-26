const express = require("express");
const router = express.Router(); 
const orderController = require("../controllers/orderController");
const auth = require("../auth");

router.get("/all", orderController.getAllOrders);
router.post("/details",  auth.verify, orderController.getOrderDetails); // auth user
router.post("/checkout", orderController.checkoutOrder);

module.exports = router;
