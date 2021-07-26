const express = require("express");
const mongoose = require("mongoose");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors"); // allow sites to connect to this server
const app = express();
const port = process.env.PORT || 8000;

const dbURI = 'mongodb+srv://rodnelb:toor@zuitt-bootcamp.pfukx.mongodb.net/ecommerce-api?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify: true })
.then((result) => {
  if (result) {
    console.log('Connected to MongoDB database.');
    app.listen(port, () => console.log(`Now listening on port ${port}`));

        
    //middlewares
    app.use(cors()); 
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));

    app.use(express.static(__dirname + '/assets'));
    app.use("/assets", express.static("assets"));

    //schema & model
      // see under ./models/

    //routes
    app.use("/api/users", userRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/orders", orderRoutes);

    // 200 0K
    // 201 created
    // 401 unauthorized, identity not confirmed
    // 403 forbidden, not enough acess rights, identity known
    // 404 not found
    // 500 server error

    app.get('/', (req, res) => {
      res.sendFile('/views/index.html', { root: __dirname });
    })

    //404
    app.use((req, res) => {
      res.status(404).sendFile('./views/404.html', { root: __dirname });
    });
  }
})
.catch((err) => console.log(err));

//connect to database
// mongoose.connect('mongodb+srv://rodnelb:toor@zuitt-bootcamp.pfukx.mongodb.net/ecommerce-api?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

//notification
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log(`We're connected to MongoDB Database`)
// });



