// [NEW FILE]
const express = require("express");
const router = express.Router(); 
const productController = require("../controllers/productController");
const auth = require("../auth");

router.get("/all", productController.getAllProducts);
router.post("/:productID", productController.getProductDetails);
router.post("/create",  productController.createProduct);
router.get("/update", auth.verify, productController.updateProduct);
router.get("/archive", auth.verify, productController.productArchiveToggle); // probably toggle mech


module.exports = router;
