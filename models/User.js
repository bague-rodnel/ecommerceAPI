const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"]
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  // Must be associated with:
  // A user who owns the order
  // Products that belong to the order 

  orders: [
    {
      // orderID: {
      //   type: String,
      //   required: [true, "Order ID is required."]
      // },

      order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
      },

      _id: false
      
    }
  ],
  
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  addressShipping: {
    type: String
  },
  addressBilling: {
    type: String
  },

});

userSchema.pre('save', function(next) {
  // override any attempt to make new user admin programmatically
  // only ways to make user admin is through /setAdmin endpoint by a backdoor admin 
  // or another admin previously appointed through the same endpoint 
  // or else, manual database record edit
  this.isAdmin = false;
  next();
});

module.exports = mongoose.model("User", userSchema);


