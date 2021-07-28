const express = require("express");
const router = express.Router(); 
const productController = require("../controllers/productController");
const auth = require("../auth");

router.get("/all", productController.getAllProducts);
router.post("/create", auth.verify, auth.requireAdmin, productController.createProduct);
router.get("/:productID", productController.getProductDetails);
router.put("/:productID", auth.verify, auth.requireAdmin, productController.updateProductByID);
router.delete("/:productID", auth.verify, auth.requireAdmin, productController.deleteProduct); 
router.put("/:productID/archive", auth.verify, auth.requireAdmin, productController.archiveProduct); 
router.put("/:productID/unarchive", auth.verify, auth.requireAdmin, productController.unarchiveProduct); 


module.exports = router;

/*
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

