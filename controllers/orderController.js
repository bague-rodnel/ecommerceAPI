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
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  })
}

// this method will only return the orderIDs
// a separate /api/orders/:orderID will return the details
module.exports.getLoggedUserOrders = ( req, res ) => {
  let userData = auth.decode( req.headers.authorization );
  let userOrders = [];

  User.findById( userData.id ).then( foundUser => {
    if ( foundUser ) {
      res.status( 200 ).send( foundUser.orders );
    } else {
      res.status( 404 ).send( { order: "User info not found." } );
    }
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  })
}

module.exports.createOrder = ( req, res ) => {
  // scenario /api/orders/create post will have only the array of product IDs

  let isOrderSaved, isBuyerLinked, isProductLinked = false;
  
  // newOrder object created
  let newOrder = new Order( req.body );
  console.log("[DEBUG] createOrder() newOrder", newOrder);

  //  get buyer ID > update buyer ID
  let userData = auth.decode( req.headers.authorization );
  newOrder.buyerID = userData.id;
  
  // initialize totalAmount
  newOrder.totalAmount = 0;

  //  then save new order() retrieve the saved order's _id
  let newOrderID = newOrder.save()
  .then( saveResult => {
    console.log("[DEBUG] createOrder() saveResult", saveResult);

    // push this order _id to buyer.orders[]
    User.findByIdAndUpdate( newOrder.buyerID, { $push: { "orders": { orderID: saveResult._id } }}, { new: true } )

    // get products list and get Total > update total amount
    Promise.all(
      newOrder.products.map( (productObj) => {
        // push this order _id to product.orders[]
        return Product.findByIdAndUpdate( productObj.productID, { $push: { "orders": { orderID: saveResult._id } }} ).then( foundProduct => {

          return foundProduct.price; // mapping price for totals later
        })
      })
    )
    .then(( mappedPrices ) => { // mapped Promises resolved into mapped prices
      newOrder.totalAmount = mappedPrices.reduce( (runningSum, currentPrice) => runningSum + currentPrice);
      return newOrder.save();
    })
    .then( result => {
      res.status( 201 ).send( " New order created. Records synced. " );
    })
    .catch( error => {
      res.status( 500 ).send({ error: "Internal server error. Cannot process your request." });
    })
  });
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