const mongoose = require("mongoose");
const bcrypt = require( "bcrypt" );
const { isEmail } = require("validator");


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    required: [true, "Email is required"],
    validate: [isEmail, "Please eneter a valid email"]
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
  mobileNo: {
    type: String
  },
  addressShipping: {
    type: String
  },
  addressBilling: {
    type: String
  },
  isSuspended: {
    type: Boolean,
    default: false
  },
  agreedTnC: {
    type: Boolean
  }
});

userSchema.pre('save', function(next) {
  // override any attempt to make new user admin programmatically
  this.isAdmin = false;
  this.password = bcrypt.hashSync( this.password, 10 );
  next();
});

module.exports = mongoose.model("User", userSchema);


