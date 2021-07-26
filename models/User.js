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
      orderID: {
        type: String,
        required: [true, "Order ID is required."]
      }
    }
  ]
});

module.exports = mongoose.model("User", userSchema);



