const express = require("express");
const router = express.Router(); 
const productController = require("../controllers/productController");
const auth = require("../middlewares/auth");

router.get("/runcode", productController.runCode);
router.get("/", productController.getProducts);
router.post("/", auth.verify, auth.requireAdmin, productController.createProduct);
// router.get("/all", auth.verify, auth.requireAdmin, productController.getAllProducts);
router.get("/ratings/:productID", productController.getProductRating);
router.get("/:productID", productController.getProductDetails);
router.put("/:productID", auth.verify, auth.requireAdmin, productController.updateProductByID);
router.delete("/:productID", auth.verify, auth.requireAdmin, productController.deleteProduct); 
router.put("/:productID/archive", auth.verify, auth.requireAdmin, productController.archiveProduct); 
router.put("/:productID/unarchive", auth.verify, auth.requireAdmin, productController.unarchiveProduct); 
router.get("/:productID/variants", productController.getVariants);
router.post("/:productID/variants", productController.addVariant);
router.get("/:productID/variants/:sku", productController.getVariantDetails);
router.put("/:productID/variants/:sku", productController.updateVariant);
router.delete("/:productID/variants/:sku", productController.deleteVariant);
router.post("/:productID/reviews", productController.addReview);
router.get("/:productID/reviews", productController.getProductReviews);
router.delete("/:productID/reviews", productController.deleteReviews);


module.exports = router;
