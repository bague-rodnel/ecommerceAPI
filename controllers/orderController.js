const Order = require( "./../models/Order" );
const Product = require( "./../models/Product" );
const User = require( "./../models/User" );
const auth = require( "../auth" );


module.exports.getAllOrders = ( req, res ) => {
  Order.find( {} ).then( ( result, error ) => {
    if ( error ) {
      res.status( 500 ).send( { error: error } );
    } else {
      res.status( 200 ).send( result );
    }
  })
}

module.exports.getLoggedUserOrders = ( req, res ) => {
  let userData = auth.decode( req.headers.authorization );
  let userOrders = [];

  // console.log("[DEBUG] orderController.js > getLoggedUserORders()")
  // console.log(userDetails);
  User.findById( userData.id ).then( foundUser => {
    if ( foundUser ) {
      foundUser.orders.forEach( orderID => {
        Order.findById( orderID ).then( foundOrder => {
          userOrders.push( foundOrder );
        });
      })
    
      res.status( 200 ).send( userOrders );
    } else {
      res.status( 404 ).send( { order: "User info not found." } );
    }
  })
}

module.exports.createOrder = async ( req, res ) => {
  // let isOrderSaved, isBuyerLinked, isProductLinked = false;

  // let newOrder = new Order( req.body );
  // isOrderSaved = await newOrder.save()
  // .then( ( order , err ) => {
  //   if ( err ) {
  //     res.status( 500 ).send( { error: err } );
  //   }

    
  // })
  // .then( ( result, err ) => {
  // })

  // if ( isOrderSaved && isBuyerLinked && isProductLinked ) {
  //   res.status( 201 ).send( "Order created and records are synced." );
  // } else {
  //   res.status( 500 ).send( { error: err } );
  // }
}
