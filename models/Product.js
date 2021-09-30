const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productNo: { type: String, unique: true, required: [true, "Product ID is required"] },
  name: { type: String, required: [true, "Product name is required"] },
  description: { type: String, required: [true, "Product description is required"] },
  category: { type: String, required: [true, "Product category is required"] },
  stock: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  createdOn: { type: Date, default: new Date() },
  rating: { type: Number, default: 0 },

  // varies by color, size, etc'
  // for the meantime I'm only supporting color
  variations: [ 
    { type: String, enum: { values: ['color'], message: "Please select correct variantion." } } 
  ],
  price: { type: Number, required: [true, "Product price is required"] },
  variants: [
    {
      sku: { type: String, required: true, unique: true },
      images: [{
        public_id: { type: String, required: true },
        url: { type: String, required: true }
      }],
      color: String,
      _id: false
    }
  ],
  reviews: [
    {
      buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, required: true },
      review: { type: String, required: true },
      rating: { type: Number, min: 1, max: 5 }
    }
  ]
});

productSchema.methods.updateRating = async function() {

  if ( !this.reviews.length ) return;
  if ( !this.isModified("reviews") ) return;

  this.rating = this.reviews.reduce((runVal, review) => runVal + review.rating) / this.reviews.length;
  await this.save({ validateBeforeSave: false });
}

productSchema.methods.addProductReview = async function(review) {
  this.reviews.push(review);
  await this.save({ validateBeforeSave: false });
  await this.updateRating();
}

module.exports = mongoose.model( "Product" , productSchema );

