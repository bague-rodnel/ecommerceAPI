const Order = require( "./../models/Order" );
const Product = require( "./../models/Product" );
const User = require( "./../models/User" );
const auth = require( "../auth" );


// module.exports.getAllOrders = ( req, res ) => {
//   Order.find( {} ).then( ( result, error ) => {
//     if ( error ) {
//       res.status( 500 ).send( { error: error } );
//     } else {
//       res.status( 200 ).send( result );
//     }
//   })
//   .catch( error => {
//     res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
//   })
// }


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