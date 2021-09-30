const express = require("express");
const router = express.Router(); 
const shippingController = require("../controllers/shippingController");

router.get("/countries", shippingController.getCountries);
router.get("/:countryCode/regions", shippingController.getRegions);
router.get("/:countryCode/:regionCode/options", shippingController.getShippingOptions);

module.exports = router;