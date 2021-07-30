const express = require("express");
const router = express.Router(); 
const productController = require("../controllers/productController");
const auth = require("../auth");



// Retrieve All Active Products router.get("/"...)
//   1. A GET request is sent to the /products endpoint.
//   2. API retrieves all active products and returns them in its response.
router.get("/", productController.getAllActiveProducts);

// Create Product Workflow router.post("/"...)
//   1. An authenticated admin user sends a POST request containing a JWT in its header to the /products endpoint.
//   2. API validates JWT, returns false if validation fails.
//   3. If validation successful, API creates product using the contents of the request body
router.post("/", auth.verify, auth.requireAdmin, productController.createProduct);

router.get("/all", auth.verify, auth.requireAdmin, productController.getAllProducts);

// Retrieve Single Product router.get("/:productID...")
//   1. A GET request is sent to the /products/:productId endpoint.
//   2. API retrieves product that matches productId URL parameter and returns it in its response.
router.get("/:productID", productController.getProductDetails);

// Update Product router.put("/:productID...")
//   1. An authenticated admin user sends a PUT request containing a JWT in its header to the /products/:productId endpoint.
//   2. API validates JWT, returns false if validation fails.
//   3. If validation successful, API finds product with ID matching the productId URL parameter and overwrites its info with those from the request body.
router.put("/:productID", auth.verify, auth.requireAdmin, productController.updateProductByID);

router.delete("/:productID", auth.verify, auth.requireAdmin, productController.deleteProduct); 

// Archive Product router.put("/:productID/archive"...)
//   1. An authenticated admin user sends a PUT request containing a JWT in its header to the /products/:productId/archive endpoint.
//   2. API validates JWT, returns false if validation fails.
//   3. If validation successful, API finds product with ID matching the productId URL parameter and sets its isActive property to false.
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

