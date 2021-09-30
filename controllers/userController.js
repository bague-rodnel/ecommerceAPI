const Order = require( "../models/Order" );
const Product = require( "../models/Product" );
const User = require( "../models/User" );
const auth = require( "../middlewares/auth" );
const bcrypt = require("bcrypt");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const crypto = require("crypto");
const sendToken = require("../utils/sendToken");
const sendEmail = require("../utils/sendEmail");



module.exports.registerUser = catchAsyncErrors(async ( req, res, next ) => {
  let newUser = new User({
    ...req.body, 
    avatar: {
      public_id: 'avatars/placeholder_r1ersw.png',
      url: 'https://res.cloudinary.com/dffo0atg0/image/upload/v1629405596/avatars/placeholder_r1ersw.png'
    }
  });

  newUser.isAdmin = false; // tmp, require /setasadmin route as a means to make admin
  const result = await newUser.save();

  res.status( 201 ).json({ 
    success: true, 
    result: result 
  });
})

module.exports.loginUser = catchAsyncErrors(async ( req, res, next ) => {
  const { email, password } = req.body;

  if ( !email || !password ) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if ( !user ) {
    return next(new ErrorHandler("Email/password is not correct", 401));
  }

  const isPasswordCorrect = await user.comparePassword( password ); 
  if( !isPasswordCorrect ){
    return next(new ErrorHandler("Email/password is not correct", 401));
  } 

  sendToken(user, 200, res);
})


module.exports.logout = catchAsyncErrors( async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true
  });

  res.status( 200 ).json({
    success: true,
    message: "Logged out."
  })
})

module.exports.updatePassword = catchAsyncErrors( async (req, res, next) => { 
  const user = await User.findById( req.user._id ).select("+password");

  const isMatched = await user.comparePassword( req.body.oldPassword );
  if ( !isMatched ) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  user.password = req.body.password;
  await user.save({ validateBeforeSave: false});
 
  sendToken(user, 200, res);
})

module.exports.forgotPassword = catchAsyncErrors( async (req, res, next) => {
  const user = await User.findOne({ email: req.body. email });

  if ( !user ) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  // Get reset token
  const resetToken = await user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset password url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/users/password/reset/${resetToken}`;
  const message = `Your passsword reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "ShopIT Password Recovery",
      message
    });

    res.status( 200 ).json({
      success: true,
      message: `Email sent to: ${user.email}`
    });
    
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
})

module.exports.resetPassword = catchAsyncErrors( async (req, res, next) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({  
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  })

  if ( !user ) {
    return next(new ErrorHandler("Password reset token is invalid or has been expired", 400));
  }

  if ( req.body.password !== req.body.confirmPassword ) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  // setup new password
  user.password = req.body.password;

  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save({ validateBeforeSave: false });

  sendToken(user, 200, res);
})


module.exports.userCheckout = catchAsyncErrors(async ( req, res, next ) => {
  // scenario /api/orders/create post will have only the array of { productID, quantity }

  try {
    // var allows reference inside catch block
    var newOrder = new Order( req.body );

    // throw new Error("testing catch block");

    newOrder.buyer = req.user._id; // set by auth middleware
    newOrder.totalAmount = 0; // see Order.js

    let result = await newOrder.save();

    res.status( 201 ).json({ 
      success: true, 
      result: result 
    });
  } catch (error) {
    // important that this is a doc.remove() and not Model.remove();
    // otherwise pre hook will not fire
    await newOrder.remove();
    return next(new ErrorHandler(null,null));
  }
})



// ========================= /me routes, user is embedded in req by auth =============

// /api/users/me
module.exports.getLoggedUserInfo = catchAsyncErrors(async ( req, res, next ) => {
  let foundUser = req.user; // auth.verify

  // await User.findById( req.user._id );
  if ( !foundUser ) {
    return next(new ErrorHandler(`User (${req.user._id}) not found.`, 404));
  } 

  res.status( 200 ).json({
    success: true,
    data: foundUser 
  });
})


// /api/users/me
module.exports.updateLoggedUserInfo = catchAsyncErrors(async ( req, res, next ) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email
  };

  const result = await User.findByIdAndUpdate( req.user._id, 
                    newUserData, { new: true, runValidators: true } );

  if ( !result ) {
    return next(new ErrorHandler(`User (${req.user._id}) not found.`, 404));
  } 

  res.status( 200 ).json({ 
    success: true, 
    result: result 
  });
})

// /api/users/myOrders
module.exports.getLoggedUserOrders = catchAsyncErrors(async ( req, res, next ) => {
  const foundUser = await User.findById( req.user._id )
  .populate({
    path: "orders.order",
    model: "Order",
    select: "-buyer",
    populate: {
      path: "products.product",
      model: "Product",
      select: "name sku description"
    }
  })

  res.status( 200 ).json({
    success: true,
    data: foundUser.orders
  });
})



// ================================ ADMIN ROUTES ===========================

// api/users/
module.exports.getAllUsers = catchAsyncErrors(async ( req, res, next ) => {
  const result = await User.find( {} );
  if ( !result ) {
    return next(new ErrorHandler("No user found.", 404));
  } 

  res.status( 200 ).json({ 
    succes: true,
    data: result
  });
})

// api/users/orders
module.exports.getAllOrders = catchAsyncErrors(async ( req, res, next ) => {
  const result = await Order.find( {}, 
    {
      "_id": "$_id",
      "purchasedOn": "$purchasedOn",
      "totalAmount": "$totalAmount",
      "buyer": "$buyer",
      "products": "$products"
    }
  )
  .populate({
    path: "buyer",
    model: "User",
    select: "email"
  })
  .populate({
    path: "products.product",
    model: "Product",
    select: "_id name sku description"
  })

  res.status( 200 ).json({
    success: true,
    data: result 
  });
})

// /api/users/:userID
module.exports.getUserByID = catchAsyncErrors(async ( req, res, next ) => {
  const foundUser = await User.findById( req.params.userID );

  if ( !foundUser ) {
    return next(new ErrorHandler(`User (${req.params.userID}) not found.`, 404));
  }

  res.status( 200 ).json({
    success: true,
    data: foundUser
  });
})

// /api/users/:userID
module.exports.updateUserByID = catchAsyncErrors(async ( req, res, next ) => {
  const result = await User.findByIdAndUpdate( req.params.userID, req.body, {new: true} );

  if ( !result ) {
    return next(new ErrorHandler(`User (${req.params.userID}) not found.`, 404));
  } 

  res.status( 200 ).json({ 
    success: true,
    result: result 
  });
})

// api/users/:userID
module.exports.deleteUser = catchAsyncErrors(async ( req, res, next ) => {
  const user = await User.findByIdAndDelete( req.params.userID );

  if ( !user ){
    return next(new ErrorHandler(`User not found with id: ${req.params.userID}`));
  }

  // remove avatar from cloudinary - TODO
  await user.remove();

  res.status( 200 ).json({ 
    success: true, 
    message: "User is not deleted."
  });
})

// api/users/:userID/setAsAdmin
module.exports.setAsAdmin = catchAsyncErrors(async ( req, res, next ) => {
  const result = await User.findByIdAndUpdate( req.params.userID, { isAdmin: true }, {new: true} );
  if ( !result ) {
    return next(new ErrorHandler(`User (${req.params.userID}) not found.`, 404));
  }
  
  res.status( 200 ).json({ 
    success: true, 
    result: result 
  });
})

// api/users/:userID/setAsNonAdmin
module.exports.setAsNonAdmin = catchAsyncErrors(async ( req, res, next ) => {
  const result = await User.findByIdAndUpdate( req.params.userID, { isAdmin: false }, {new: true} );
  if ( !result ) {
    return next(new ErrorHandler(`User (${req.params.userID}) not found.`, 404));
  } 

  res.status( 200 ).json({ 
    success: true, 
    result: result 
  });
})