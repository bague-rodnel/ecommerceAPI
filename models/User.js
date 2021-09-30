const mongoose = require("mongoose");
const bcrypt = require( "bcrypt" );
const { isEmail } = require("validator");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    required: [true, "Email is required"],
    unique: true,
    validate: [isEmail, "Please eneter a valid email"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  avatar: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String, 
      required: true
    }
  },
  
  firstName: {
    type: String,
    default: ""
  },
  lastName: {
    type: String,
    default: ""
  },
  mobileNo: {
    type: String,
    default: ""
  },
  addressShipping: {
    type: String,
    default: ""
  },
  addressBilling: {
    type: String,
    default: ""
  },
  isSuspended: {
    type: Boolean,
    default: false,
    select: false
  },
  agreedTnC: {
    type: Boolean
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

userSchema.pre('save', async function(next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash( this.password, 10 );
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

// generate password reset token
userSchema.methods.getResetPasswordToken = async function() {
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash and set to resetPaswordToken
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // set expire time
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  return resetToken;
}

module.exports = mongoose.model("User", userSchema);


