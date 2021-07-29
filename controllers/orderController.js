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
  //let userData = auth.decode( req.headers.authorization );
  let userOrders = [];

  User.findById( req.userID ).then( foundUser => {
    if ( foundUser ) {
      res.status( 200 ).send( foundUser.orders );
    } else {
      res.status( 404 ).send( { order: `User (${req.userID}) not found.` } );
    }
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  })
}

module.exports.createOrder = ( req, res ) => {
  // scenario /api/orders/create post will have only the array of { productID, quantity}

  let isOrderSaved, isBuyerLinked, isProductLinked = false;
  
  // newOrder object created
  let newOrder = new Order( req.body );
  // console.log("[DEBUG] createOrder() newOrder", newOrder);

  //  get requestor ID > update buyer ID
  //let userData = auth.decode( req.headers.authorization );
  //newOrder.buyerID = userData.id;
  newOrder.buyerID = req.userID;

  // initialize totalAmount
  newOrder.totalAmount = 0;

  //  then save new order() retrieve the saved order's _id
  let newOrderID = newOrder.save()
  .then( saveResult => {

    // push this order _id to buyer.orders[]
    User.findByIdAndUpdate( newOrder.buyerID, { $push: { "orders": { orderID: saveResult._id } }}, { new: true } )
    .then( result => {

      // get products list and get Total > update total amount
      Promise.all(
        newOrder.products.map( (productObj) => {
          // push this order _id to product.orders[]
          return Product.findByIdAndUpdate( productObj.productID, { $push: { "orders": { orderID: saveResult._id } }} ).then( foundProduct => {

            newOrder.purchasePrice = foundProduct.price;
            return foundProduct.price * productObj.quantity; // mapping price for totals later
          })
        })
      )
      .then(( mappedPrices ) => { // mapped Promises resolved into mapped prices
        newOrder.totalAmount = mappedPrices.reduce( (runningSum, currentPrice) => runningSum + currentPrice);
        return newOrder.save();
      })
      .then( result => {
        res.status( 201 ).send( { success: " New order created. Records synced. ", result: result } );
      })
      .catch( error => {
        res.status( 500 ).send({ error: "Internal server error. Cannot process your request." });
      })
    });
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

module.exports.deleteOrder = ( req, res ) => {
  let orderID = req.params.orderID;

  Product.findByIdAndDelete( orderID ).then( result => {
    res.status( 200 ).send( { success: `Order (${orderID}) is now deleted.`, deleted: result } );
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  })
}