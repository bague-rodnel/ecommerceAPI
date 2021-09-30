const Product = require("../models/Product");
const dotenv = require("dotenv");
const connectDB = require("../db");

const products = require("../data/products");

// setting dotenv
dotenv.config();

connectDB();

const seedProducts = async ( ) => {
  try {
    await Product.deleteMany();
    console.log(`Products are deleted`);

    await Product.insertMany(products);
    console.log(`Products are now seeded`);

    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
}

seedProducts();