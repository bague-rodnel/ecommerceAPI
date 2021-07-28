const Product = require( "./../models/Product" );
const auth = require( "../auth" );

this.findBySKU = ( thisSKU ) => {
  return Product.findOne( { sku: thisSKU } ).then( ( result ) => {
    return result;
  })
};

module.exports.getAllProducts = ( req, res ) => {
  let showActiveOnly = true;

  if (req.isAdmin && (req.body.isActive == "false") ) {
    showActiveOnly = false;
  }

  Product.find( { isActive : showActiveOnly } ).then( ( result, error ) => {
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

module.exports.getProductDetails = ( req, res ) => {
  let productID = req.params.productID;

  Product.findById( productID ).then( foundProduct => {
    if ( foundProduct ) {
      res.status( 200 ).send( foundProduct );
    } else {
      res.status( 404 ).send( { error: `Product (${productID}) not found.` } );
    }
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  })
}

module.exports.createProduct = ( req, res ) => {
  this.findBySKU( req.body.sku ).then ( foundProduct => {
    if ( !foundProduct ) {

      let newProduct = new Product( req.body );
    
      newProduct.save().then( ( result, err ) => {
        if ( err ) {
          res.status( 500 ).send( { error: err } );
        } else {
          res.status( 201 ).send( result );
        }
      })
    } else {
      res.status( 409 ).send( { error: "SKU is already in use." });
    }
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request.", details: error } );
  })
}

module.exports.updateProductByID = ( req, res ) => {
  let productID = req.params.productID;

  Product.findByIdAndUpdate( productID, req.body, { new: true }).then( result => {
    if ( result ) {
      res.status( 200 ).send( result );
    } else {
      res.status( 404 ).send( { error: `Product (${productID}) not found.` } );
    }
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  })
}

module.exports.archiveProduct = ( req, res ) => {
  let productID = req.params.productID;

  Product.findByIdAndUpdate( productID, { isActive: false }, { new: true } ).then( result => {
    if ( result ) {
      res.status( 200 ).send( result );
    } else {
      res.status( 404 ).send( { error: `Product (${productID}) not found.` } );
    }
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  })
}

module.exports.unarchiveProduct = ( req, res ) => {
  let productID = req.params.productID;

  Product.findByIdAndUpdate( productID, { isActive: true }, { new: true } ).then( result => {
    if ( result ) {
      res.status( 200 ).send( result );
    } else {
      res.status( 404 ).send( { error: `Product (${productID}) not found.` } );
    }
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  })
}

module.exports.deleteProduct = ( req, res ) => {
  let productID = req.params.productID;

  Product.findByIdAndDelete( productID ).then( result => {
    res.status( 200 ).send( { success: `Product (${productID}) is now deleted.`, deleted: result } );
  })
  .catch( error => {
    res.status( 500 ).send( { error: "Internal Server Error: Cannot process your request." } );
  })
}