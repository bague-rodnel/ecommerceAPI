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

// orderSchema.pre('save', function(next) {
//   let total = 0;

//   this.products.forEach( productID => {
//     Product.findById( productID ).then( foundProduct => {
//       total += foundProduct.price;
//     })
//   });

//   this.totalAmount = total;
//   next();
// });

module.exports = mongoose.model("Order", orderSchema);
