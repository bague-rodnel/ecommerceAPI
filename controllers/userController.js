const Order = require( "./../models/Order" );
const Product = require( "./../models/Product" );
const User = require( "./../models/User" );
const auth = require( "../auth" );
const mongoose = require("mongoose");


//CHECK IF EMAIL EXISTS
this.findByEmail = ( thisEmail ) => {
  return User.findOne( { email: thisEmail } ).then( ( result ) => {
    return result;
  })
};

module.exports.getAllUsers = ( req, res ) => {
  User.find( {} ).then( result => {
    if ( result ) {
      res.status( 200 ).send( result );
    } else {
      res.status( 404 ).send( { error: "No records found." } );
    }
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  })
}


//REGISTER USER
//to hash the password: https://www.npmjs.com/package/bcrypt
//hashSync is a funtion of bcrypt that encrypts the password and the 10 is a number of times it runs the encryption

module.exports.registerUser = ( req, res ) => {
  this.findByEmail( req.body.email ).then( foundUser => {
    if ( !foundUser ) {
      let newUser = new User( req.body );

      return newUser.save().then( result => {
        result.password = "********";
        res.status( 201 ).send( { success: `New user registered.`, result: result } );
      })
    } else {
      res.status( 409 ).send( { error: "Email is already in use." } );
    }
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  })
}

module.exports.loginUser = ( req, res ) => {
  this.findByEmail( req.body.email ).then( foundUser => {
    if( !foundUser ){
      res.status( 401 ).send( { error: "email/password is not correct" } ); //User doesn't exist
    } else {
      const isPasswordCorrect = bcrypt.compareSync( req.body.password, foundUser.password ); //returns boolean
      if( isPasswordCorrect ){
        res.status( 200 ).send( { access: auth.createAccessToken( foundUser ) } );
      } else {
        res.status( 401 ).send( { error: "email/password is not correct" } ); //password didn't match
      } 
    }
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  })
}

module.exports.getLoggedUserInfo = ( req, res ) => {
  User.findById( req.userID ).then( foundUser => {
    if ( foundUser ) {
      foundUser.password = "********";
      res.status( 200 ).send( foundUser );
    } else {
      res.status( 404 ).send( { error: `User (${req.userID}) not found.` } );
    }
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  })
}

module.exports.updateLoggedUserInfo = ( req, res ) => {
  User.findByIdAndUpdate( req.userID, req.body, { new: true } ).then( result => {
    if ( result ) {
      res.status( 200 ).send( { success: `User (${req.userID}) has been updated.`, result: result } );
    } else {
      res.status( 404 ).send( { error: `User (${req.userID}) not found.` } );
    }
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  })
}

module.exports.getLoggedUserOrders = ( req, res ) => {
  User.findById( req.userID )
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
  .then( foundUser => {
    if ( foundUser ) {
      if ( foundUser.orders ) {
        res.status( 200 ).send( foundUser.orders );
      } else {
        res.status( 404 ).send( { error: `No orders by user (${req.userID}) found.` } );  
      }
    } else {
      res.status( 404 ).send( { error: `User (${req.userID}) not found.` } );
    }
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  })
}

module.exports.getUserByID = ( req, res ) => {
  let userID = req.params.userID;

  User.findById( userID ).then( foundUser => {
    if ( foundUser ) {
      foundUser.password = "********";
      res.status( 200 ).send( foundUser );
    } else {
      res.status( 404 ).send( { error: `User (${userID}) not found.` } );
    }
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  })
}

module.exports.updateUserByID = ( req, res ) => {
  let userID = req.params.userID;

  User.findByIdAndUpdate( userID, req.body, {new: true} ).then( result => {
    if ( result ) {
      res.status( 200 ).send( { success: `User (${userID}) has been updated.`, result: result } );
    } else {
      res.status( 404 ).send( { error: `User (${userID}) not found.` } );
    }
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  })
}

module.exports.setAsAdmin = ( req, res ) => {
  let userID = req.params.userID;

  User.findByIdAndUpdate( userID, { isAdmin: true }, {new: true} ).then( result => {
    if ( result ) {
      res.status( 200 ).send( { success: `User (${userID}) is now an admin.`, result: result } );
    } else {
      res.status( 404 ).send( { error: `User (${userID}) not found.` } );
    }
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  })
}

module.exports.setAsNonAdmin = ( req, res ) => {
  let userID = req.params.userID;

  User.findByIdAndUpdate( userID, { isAdmin: false }, {new: true} ).then( result => {
    if ( result ) {
      res.status( 200 ).send( { success: `User (${userID}) is now a regular user.`, result: result } );
    } else {
      res.status( 404 ).send( { error: `User (${userID}) not found.` } );
    }
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  })
}

module.exports.deleteUser = ( req, res ) => {
  let userID = req.params.userID;

  User.findByIdAndDelete( userID ).then( result => {
    if ( result ) {
      res.status( 200 ).send( { success: `User (${userID}) is now deleted.`, result: result } );
    } else {
      res.status( 404 ).send( { error: `User (${userID}) not found.` } );
    }
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  })
}

module.exports.userCheckout = async ( req, res ) => {
  // scenario /api/orders/create post will have only the array of { productID, quantity }
  try {
    // newOrder object created
    let newOrder = new Order( req.body );

    newOrder.buyer = req.userID;
    newOrder.totalAmount = 0;

    let newOrderID = await newOrder.save(); //i could be wrong here

    // pull up unit price of product and map price*qty for final total
    let mappedPrices = await Promise.all(
      newOrder.products.map( (productObj) => {
        return Product.findById( productObj.product )
        .then( foundProduct => {
          if (foundProduct.stock >= productObj.quantity) {
            foundProduct.stock -= productObj.quantity;
            foundProduct.orders.push(newOrderID);
            foundProduct.save();
            productObj.unitPriceAtCheckout = foundProduct.price;
            return foundProduct.price * productObj.quantity; 
          } else {
            throw new Error(`Not enough stock for product ID (${foundProduct._id})`);
          }
        })
      })
    )
    newOrder.totalAmount = mappedPrices.reduce( (runningSum, currentPrice) => runningSum + currentPrice);

    // push this newOrderID to User.orders[]
    await User.findByIdAndUpdate( req.userID, { $push: { "orders": { order: newOrderID } }}, { new: true } );

    let result = await newOrder.save();
    res.status( 201 ).send( { success: "New order created. Records synced.", result: result } );

  } catch (error) {
    res.status( 500 ).send({ error: "Internal server error. Cannot process your request." + error });
  }
}

module.exports.getAllOrders = ( req, res ) => {
  Order.find( {}, 
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