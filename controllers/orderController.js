const Order = require( "./../models/Order" );
const Product = require( "./../models/Product" );
const User = require( "./../models/User" );
const auth = require( "../auth" );


module.exports.getAllOrders = ( req, res ) => {
  Order.find( {}, 
    {
      "_id": "$_id",
      "purchasedOn": "$purchasedOn",
      "totalAmount": "$totalAmount",
      "products": "$products"
    }
  )
  .populate({
    path: "products.product",
    model: "Product",
    select: "_id name sku description"
  })
  .then( result => {
    if ( result ) {
      res.status( 200 ).send( result );
    } else {
      res.status( 404 ).send( { error: "No orders found." } );
    }
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  })
}


module.exports.getOrderDetails = ( req, res ) => {
  let orderID = req.params.orderID;

  Order.findById( orderID ).then( foundOrder => {
    if ( foundOrder ) {
      res.status( 200 ).send( foundOrder );
    } else {
      res.status( 404 ).send( { error: "Order not found."} );
    }
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  });
}

module.exports.deleteOrder = ( req, res ) => {
  let orderID = req.params.orderID;

  Product.findByIdAndDelete( orderID ).then( result => {
    res.status( 200 ).send( { success: `Order (${orderID}) is now deleted.`, deleted: result } );
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  })
}