const mongoose = require("mongoose");
const Product = require( "./../models/Product" );

const orderSchema = new mongoose.Schema({
  totalAmount: {
    type: Number,
    required: [true, "Total amount is required"]
  },
  purchasedOn: {
    type: Date,
    default: new Date()
  },
  addressShippedTo: {
    type: String
  },
  addressBilledTo: {
    type: String
  },
  // Must be associated with:
  // A user who owns the order
  // Products that belong to the order 

  // only one buyer ID is needed 
  buyerID: {
    type: String,
    default: "-1"    // guest
  },
  // array of product IDs
  products: [
    {
      productID: {
        type: String,
        required: [true, "Product ID is required."]
      }
    }
  ]
});

module.exports = mongoose.model("Order", orderSchema);
