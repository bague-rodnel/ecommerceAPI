const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({
  totalAmount: {
    type: Number,
    required: [true, "Total amount is required"]
  },
  purchsedOn: {
    type: Date,
    default: new Date()
  },
  // Must be associated with:
  // A user who owns the order
  // Products that belong to the order 

  // array of user IDs
  buyers: [
    {
      userID: {
        type: String,
        required: [true, "Buyer ID is required."]
      }
    }
  ], 
  
  // array of products
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

