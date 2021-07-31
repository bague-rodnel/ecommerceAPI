const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"]
  },
  sku: {
    type: String,
    required: [true, "Product SKU is required."]
    //unique: ill deal with this later
  },
  description: {
    type: String,
    required: [true, "Product description is required"]
  },
  stock: {
    type: Number,
    default: 1
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
      order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
      },

      _id: false
    }
  ]
});

module.exports = mongoose.model( "Product" , productSchema );

