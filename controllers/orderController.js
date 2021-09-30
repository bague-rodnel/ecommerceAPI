const Order = require( "../models/Order" );
const Product = require( "../models/Product" );
const User = require( "../models/User" );
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")

module.exports.runCode = catchAsyncErrors(async ( req, res, next ) => {
  // console.log('inside runcode()');
  // let newUser = new User({ "email": "asdf@asdf.com", "password": "random" });

  // await newUser.remove().then( result => {
  //   console.log(`returning from newUser.remove() before .save(): ${result}`);
  // });
  // res.send('done');
});

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
  });
  
  if ( !result ) {
    return next(new ErrorHandler("No product found", 404));
  }

  res.status( 200 ).json({
    success: true,
    data: result
  });
})


module.exports.getOrderDetails = catchAsyncErrors(async ( req, res, next ) => {
  const orderID = req.params.orderID;

  const result = await Order.findById( orderID );
  if ( !result ) {
    return next(new ErrorHandler("Order not found.", 404));
  }
  
  res.status( 200 ).json({
    success: true,
    data: result
  });
})

module.exports.deleteOrder = catchAsyncErrors(async ( req, res, next ) => {
  const orderID = req.params.orderID;

  await Product.findByIdAndDelete( orderID );

  res.status( 200 ).send({ 
    success: true, 
    message: "Order is now deleted."
  });
})