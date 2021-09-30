const express = require("express");
const mongoose = require("mongoose");
const connectDB = require('./db');
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const shippingRoutes = require("./routes/shippingRoutes");
const cors = require("cors"); 
const env = require("dotenv");
const app = express();
const errorMiddleware = require("./middlewares/errors");
const cookieParser = require("cookie-parser");

process.on('uncaughtException', err => {
  console.log(`ERROR: ${err.stack}`);
  console.log("Shutting down the server due to uncaught exception");
  process.exit(1);
});

env.config();

connectDB();

//middlewares
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use(express.static(__dirname + '/assets'));
app.use("/assets", express.static("assets"));

//schema & model
// see under ./models/

//routes
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/shipping", shippingRoutes);

// MIddleware to handle errors 
app.use(errorMiddleware);

const port = process.env.PORT || 8000;
const server = app.listen(port, () => console.log(`Now listening on port ${port}`));

process.on('unhandledRejection', err => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise rejection");
  server.close(() => {
    process.exit(1);
  })
})
    