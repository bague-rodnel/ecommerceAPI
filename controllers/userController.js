const User = require( "./../models/User" );
const bcrypt = require( "bcrypt" );
const auth = require( "../auth" );


//CHECK IF EMAIL EXISTS
this.findByEmail = ( thisEmail ) => {
  return User.findOne( { email: thisEmail } ).then( ( result ) => {
    return result;
  })
};

module.exports.getAllUsers = ( req, res ) => {
  // console.log("[DEBUG] req.isAdmin ", req.isAdmin);
  User.find( {} ).then( ( result, error ) => {
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


//REGISTER USER
//to hash the password: https://www.npmjs.com/package/bcrypt
//hashSync is a funtion of bcrypt that encrypts the password and the 10 is a number of times it runs the encryption

module.exports.registerUser = ( req, res ) => {
  this.findByEmail( req.body.email ).then( foundUser => {
    if ( !foundUser ) {
      let newUser = new User( req.body );
      newUser.password = bcrypt.hashSync( req.body.password, 10 );

      newUser.save().then( ( result, err ) => {
        if ( err ) {
          res.status( 500 ).send( { error: err } );
        } else {
          result.password = "********";
          res.status( 201 ).send( result );
        }
      })
      .catch( error => {
        res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
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
  let userData = auth.decode( req.headers.authorization );

  User.findById( userData.id ).then( foundUser => {
    if ( foundUser ) {
      foundUser.password = "********";
      res.status( 200 ).send( foundUser );
    } else {
      res.status( 404 ).send( { error: `User (${userData.id}) not found.` } );
    }
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  })
}

module.exports.updateLoggedUserInfo = ( req, res ) => {
  let userData = auth.decode( req.headers.authorization );

  User.findByIdAndUpdate( userData.id, req.body, { new: true } ).then( result => {
    if ( result ) {
      res.status( 200 ).send( result );
    } else {
      res.status( 404 ).send( { error: `User (${userData.id}) not found.` } );
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
      res.status( 200 ).send( result );
    } else {
      res.status( 404 ).send( { error: `User (${userID}) not found.` } );
    }
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  })
}

// router.put("/:userID/makeAdmin"
module.exports.makeUserAdmin = ( req, res ) => {
  let userID = req.params.userID;

  User.findByIdAndUpdate( userID, { isAdmin: true }, {new: true} ).then( result => {
    if ( result ) {
      res.status( 200 ).send( { success: `User (${userID}) is now an admin.` } );
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
      res.status( 200 ).send( { result: `User (${userID}) is now deleted.`, deleted: result } );
    } else {
      res.status( 404 ).send( { error: `User (${userID}) not found.` } );
    }
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  })
}