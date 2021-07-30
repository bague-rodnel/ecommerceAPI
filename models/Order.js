const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  totalAmount: {
    type: Number,
    required: [true, "Total amount is required"]
  },
  purchasedOn: {
    type: Date,
    default: new Date()
  },
  // Must be associated with:
  // A user who owns the order
  // Products that belong to the order 
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true
      },
      quantity: {
        type: Number,
        required: [true, "Product quantity is required."],
        min: [1, "Minimum product quantity is 1."]
      }
      
      // probably better to add snapshot price here
      // this price is static and may vary from the current price
      ,
      purchasePrice: {
        type: Number,
        min: [0, "Price cannot be negative."]
      },

      _id: false
    }
  ],
  addressShippedTo: {
    type: String
  },
  addressBilledTo: {
    type: String
  },
  couponCode: {
    type: String
  }
});


module.exports = mongoose.model("Order", orderSchema);
