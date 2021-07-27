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
  // console.log("[DEBUG] createOrder()", newOrderID);
  .then( saveResult => {
    console.log("[DEBUG] createOrder() saveResult", saveResult);

    // push this order _id to buyer.orders[]
    User.findByIdAndUpdate( newOrder.buyerID, { $push: { "orders": { orderID: saveResult._id } }}, { new: true } ).then( result => {
      if (result) {
        res.status(201).send("New order created.");
      } else {
        res.status(500).send({ error: "Internal server error. Can't process your request."});
      }
    });

    // get products list and get Total > update total amount
    // newOrder.products.forEach( (productObj) => {
    //   // newOrder.totalAmount += Product.findById( productObj.productID ).price;
    //   Product.findById( productObj.productID ).then( foundProduct => {
    //     // console.log("[DEBUG] createOrder() findById result", result);
    //     newOrder.totalAmount += foundProduct.price;

    //     // push this order _id to product.orders[]
    //     foundProduct.orders.push({ orderID: newOrderID });
    //   })
    // })
    // console.log("[DEBUG] createOrder() totalAmount", newOrder);
  });



  
  // isOrderSaved = await newOrder.save()
  // .then( ( result, err ) => {
  //   if ( err ) {
  //     return false
  //   }
  //   return result;
  // })
  // // if ( isOrderSaved && isBuyerLinked && isProductLinked ) {
  // if ( isOrderSaved ) {
  //   res.status( 201 ).send( "Order created and records are synced." );
  // } else {
  //   res.status( 500 ).send( { error: err } );
  // }
}
