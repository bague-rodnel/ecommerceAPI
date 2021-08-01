const express = require("express");
const mongoose = require("mongoose");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors"); 
const app = express();
const port = process.env.PORT || 8000;

const dbURI = 'mongodb+srv://rodnelb:toor@zuitt-bootcamp.pfukx.mongodb.net/ecommerce-api?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify: false })
.then((result) => {
  if (result) {
    console.log('Connected to MongoDB database.');
        
    //middlewares
    app.use(cors()); 
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));

    app.use(express.static(__dirname + '/assets'));
    app.use("/assets", express.static("assets"));

    //schema & model
      // see under ./models/

    //routes
    app.use("/api/orders", orderRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/users", userRoutes);

    // app.get('/', (req, res) => {
    //   res.sendFile('/views/index.html', { root: __dirname });
    // })

    // //404
    // app.use((req, res) => {
    //   res.status(404).sendFile('./views/404.html', { root: __dirname });
    // });
    
    app.listen(port, () => console.log(`Now listening on port ${port}`));
  }
})
.catch((err) =>  {
  redisServer.close((err) => {});
  console.log(err);
});




