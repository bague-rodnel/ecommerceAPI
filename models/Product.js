const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"]
  },
  description: {
    type: String,
    required: [true, "Product description is required"]
  },
  price: {
    type: Number,
    required: [true, "Product price is required"]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdOn: {
    type: Date,
    default: new Date()
  },

  // Must be associated with:
  // A user who owns the order
  // Products that belong to the order 
  orders: [
    {
      orderId: {
        type: String,
        required: [true, "Order ID is required."]
      }
    }
  ]
});

module.exports= mongoose.model("Product", productSchema);

