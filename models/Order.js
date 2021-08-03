const mongoose = require("mongoose");
const User = require("./User")
const Product = require("./Product")

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
      unitPriceAtCheckout: {
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


orderSchema.pre("remove", function() { 
  let orderID =  this._id;
  console.log(`inside .pre(remove) orderID: ${orderID}`);
  User.updateMany( 
    { "orders.order": orderID },   
    { $pull: { "orders": { order: orderID } } },
    { multi: true },
    (error, writeOpResult) => { } // only works if there is a cb fn weird
  );

  Product.updateMany(
    { "orders.order": orderID },   
    { $pull: { "orders": { order: orderID } } },
    { multi: true },
    (error, writeOpResult) => { } // only works if there is a cb fn weird
  ); 
})

orderSchema.pre("save", async function(next) {
  let newOrderID = this._id;

  await User.findByIdAndUpdate( this.buyer, 
    { $push: { "orders": { order: newOrderID } }}, 
    { new: true } 
  );

  var mappedPrices = await Promise.all(
    this.products.map( (productObj) => {
      return Product.findOneAndUpdate( 
        { 
          _id: productObj.product,
          stock: { $gt: productObj.quantity }
        },
        {
          $inc: {
            stock: -productObj.quantity
          },
          $push: {
            "orders": { order: newOrderID }
          }
        }
      )
      .then( foundProduct => {
        if ( foundProduct ) {
          productObj.unitPriceAtCheckout = foundProduct.price;
          return foundProduct.price * productObj.quantity; 
        } else {
          throw new Error(`Not enough stock for product ID (${productObj.product})`);
        }
      })
    })
  )
  this.totalAmount = mappedPrices.reduce( (runningSum, currentPrice) => runningSum + currentPrice);

  next();
});

module.exports = mongoose.model("Order", orderSchema);
