const Product = require( "../models/Product" );
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/APIFeatures");


module.exports.getProducts = catchAsyncErrors(async ( req, res, next ) => {
  const initFilter = req.query.all !== "true" ? { isActive: true } : {};

  const resPerPage = 4;
  const totalProducts = await Product.countDocuments();
  const apiFeatures = new APIFeatures( Product.find(initFilter), req.query )
                            .search()

  const result = await apiFeatures.query;


  if ( !result ) 
    return next(new ErrorHandler("No active product found", 404));

  res.status( 200 ).json({
    success: true,
    totalProducts,
    totalMatches: result.length,
    data: result
  })
})

module.exports.getProductDetails = catchAsyncErrors(async ( req, res, next
 ) => {
  const result = await Product.findById( req.params.productID );

  if ( !result ) 
    return next(new ErrorHandler("Product not found", 404));

  res.status( 200 ).json({
    success: true,
    data: result
  })
})

module.exports.createProduct = catchAsyncErrors(async ( req, res, next
 ) => {
  if ( await Product.findById( req.params.productID ) )
    return next(new ErrorHandler("Product ID is already in use.", 409));

  const  newProduct = new Product( req.body );
  const result = await newProduct.save();

  res.status( 201 ).json({ 
    success: true, 
    result: result 
  });
})

module.exports.updateProductByID = catchAsyncErrors(async ( req, res, next
 ) => {
  const product = await Product.findByIdAndUpdate( req.params.productID, req.body, { new: true });

  if ( result.reviews.length ) {
    product.updateRating();
  }
  
  res.status( 200 ).json({ 
    success: true, 
    result: product
  });
})

module.exports.archiveProduct = catchAsyncErrors(async ( req, res, next
 ) => {
  const result = await Product.findByIdAndUpdate( 
                          req.params.productID, 
                          { isActive: false }, 
                          { new: true } );

  if ( !result ) {
    return next(new ErrorHandler(`Product (${req.params.productID}) not found.`, 404));
  }

  res.status( 200 ).json({ 
    success: true, 
    result: result 
  });
})

module.exports.unarchiveProduct = catchAsyncErrors(async ( req, res, next
 ) => {
  const result = await Product.findByIdAndUpdate( 
                          req.params.productID, 
                          { isActive: true }, 
                          { new: true } );
  if ( !result ) {
    return next(new ErrorHandler(`Product (${req.params.productID}) not found.`, 404));
  }

  res.status( 200 ).json({ 
    success: true,
    result: result 
  });
})

module.exports.deleteProduct = catchAsyncErrors(async ( req, res, next
 ) => {
  await Product.findByIdAndDelete( req.params.productID )

  res.status( 200 ).json({ 
    success: true,
    message: `Product (${productID}) is now deleted.`
  });
})

module.exports.getVariants = catchAsyncErrors(async ( req, res, next
 ) => {
  let foundProduct = await Product.findById( req.params.productID );
  if ( !foundProduct )
    return res.status( 404 ).json( { error: `Product (${productID}) not found.` } );

  res.status( 200 ).json({
    success: true,
    data: foundProduct.variants 
  });
})

module.exports.addVariant = catchAsyncErrors(async ( req, res, next
 ) => {
  let result = await Product.findByIdAndUpdate( 
                              req.params.productID, 
                              { $push: { variants: req.body }}, 
                              { new: true });
  if (!result) {
    return next(new ErrorHandler("Bad request. Make sure input and syntax is correct.",400));
  }

  res.status( 200 ).json({ 
    success: true,
    message: `Product variant has been added` 
  });
})

module.exports.getVariantDetails = catchAsyncErrors(async ( req, res, next
 ) => {

  const foundVariant = await Product.findOne({
                              _id: req.params.productID, 
                              "variants.sku": req.params.sku })
                              .select("variants.$ -_id");


  if ( !foundVariant ) {
    return next(new ErrorHandler(`Product variant not found.`, 404))
  }

  res.status( 200 ).json({ 
    success: true,
    data: foundVariant  
  });
})

module.exports.updateVariant = catchAsyncErrors(async ( req, res, next
 ) => {
  // at the time of writing $pull and $push can't be on the same query
  let foundProduct = await Product.findOneAndUpdate(
                            { _id: req.params.productID, "variants.sku": req.params.sku },
                            { $pull: { variants: { sku: req.params.sku }}});
  
  if ( !foundProduct ) {
    return next(new ErrorHandler(`Product variant not found.`, 404));
  }
  
  const result = await Product.findOneAndUpdate(
                { _id: req.params.productID },
                { $push: { variants: req.body }},
                { new: true });

  res.status( 200 ).json({
    success: true,
    result: result
  });
})

module.exports.deleteVariant = catchAsyncErrors(async ( req, res, next
 ) => {

  await Product.findOneAndUpdate(
    { _id: req.params.productID, "variants.sku": req.params.sku },
    { $pull: { variants: { sku: req.params.sku }}});

  res.status( 200 ).json({ 
    success: true,
    message: "Variant is now deleted."
  });
})

// create new review => /api/products/:productID/reviews POST
module.exports.addReview = catchAsyncErrors( async ( req, res, next ) => {
  const { rating, review } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    review
  }

  const product = await Product.findById( req.params.productID );
  const isReviewed = product.reviews.find(
    r => r.user.toString() === req.user._id.toString()
  )

  if (isReviewed) {
    product.reviews.forEach( review => {
      if (review.user.toString() === req.user._id.toString()) {
        review.review = review;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    // product.numOfReviews = product.reviews.length; 
  }

  product.ratings = product.reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;
  await product.save({ validateBeforeSave: false });

  res.status( 200 ).json({
    success: true
  })
})

// get product reviews => /api/products/:productID/reviews GET
module.exports.getProductReviews = catchAsyncErrors( async ( req, res, next) => {
  const product = await Product.findById( req.params.productID );

  res.status( 200 ).json({
    success: true,
    reviews: product.reviews
  }) 
})

// delete product review => /api/v1/reviews?id=xxx&productId=xxxx
module.exports.deleteReviews = catchAsyncErrors( async ( req, res, next ) => {
  const product = await Product.findById( req.query.productId );

  if ( !product.reviews.length ) {
    return res.status( 200 ).json({
      success: true,
      reviews: product.reviews
    })
  }

  let reviews = product.reviews;

  if (Array.isArray(req.query.id)) {
    const toRemove = req.query.id.map( id => id.toString() );
    reviews = product.reviews.filter(
      review => !toRemove.includes(review._id.toString())
    );
  } else {
    reviews = product.reviews.filter(
    review => review._id.toString() !== req.query.id.toString());  
  }

  const numOfReviews = reviews.length;
  const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

  await Product.findByIdAndUpdate( req.query.productId, {
    reviews,
    ratings,
    numOfReviews
  }, {new: true, runValidators: true})
  
  res.status( 200 ).json({
    success: true,
    reviews: product.reviews
  })
})



module.exports.getProductRating = catchAsyncErrors(async ( req, res, next
 ) => {
  let productID = req.params.productID;

  // Product.findOne(productID, 'reviews', function(err, product) {
  //     // 2. Filter Comments to just those in product.Comments and average the Rating
  //     reviews.aggregate([
  //         {$match: {_id: {$in: product.reviews}}},
  //         {$group: {_id: product._id, average: {$avg: '$rating'}}}
  //     ], function (err, result) {});
  // })
  
  // working
  // Product.findOne({ _id: productID }, 'reviews -_id',
  //   function(err, product) {
  //     console.log(product);
  //     res.json(product);
  //   }
  // )
  

  // Product.aggregate([ 
  //   { $match: { _id:id }}, { $unwind: "$Comments" }, 
  //   { $group: { _id: "$_id", average: { $avg: "$Comments.Rating" } }} 
  // ], 
  //   function (err,result) {});

    // working
  Product.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(productID) }},
    { $unwind: "$reviews" },
    { $group: { _id: null, rating: { $avg: '$reviews.rating' }}},
    { $project: { rating: 1, _id: 0 }}
  ], function(err, result) {
    if ( result ) {
      Product.findByIdAndUpdate(productID, { rating: result[0].rating}, 
        function( err, doc ) {
          if (err) {
            res.json(err);
            return;
          }
          res.json(doc);
        });
    }
  })
})

module.exports.runCode = async (req, res, next) => {
  const prod = await Product.findById("611c7937b5e0414820d6373d");
  prod.addProductReview({
    buyer: "60ffe88bfee75f44b0c47dd0", 
    review: "test review", 
    rating: 5
  });
  
  res.status(200).json({ 
    success:true,
    message: "OK"
  });
}

