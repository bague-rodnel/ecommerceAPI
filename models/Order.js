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
  status: {
    type: String,
    default: 'processing',
    enum: ['processing', 'paid', 'shipped', 'delivered']
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
  deliveredAt: {
    type: Date
  },
  shippingInfo: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  paymentInfo: {
    id: {
      type: String
    },
    status: {
      type: String
    }
  },
  itemsTotal: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
});


orderSchema.pre("remove", function() { 
  let orderID =  this._id;
  User.updateMany( 
    { "orders.order": orderID },   
    { $pull: { "orders": { order: orderID } } },
    { multi: true },
    (error, writeOpResult) => { } 
  );

  Product.updateMany(
    { "orders.order": orderID },   
    { $pull: { "orders": { order: orderID } } },
    { multi: true },
    (error, writeOpResult) => { } 
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

// const foundVariant = await Product.findOne({
//                               _id: req.params.productID, 
//                               "variants.sku": req.params.sku })
//                               .select("variants.$ -_id");
  next();
});

module.exports = mongoose.model("Order", orderSchema);
