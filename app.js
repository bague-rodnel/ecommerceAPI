const express = require("express");
const mongoose = require("mongoose");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors"); // allow sites to connect to this server
const app = express();
const port = process.env.PORT || 8000;


//connect to database
mongoose.connect('mongodb+srv://rodnelb:toor@zuitt-bootcamp.pfukx.mongodb.net/s31_to-do?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

//notification
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(`We're connected to MongoDB Database`)
});

//middlewares
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// app.use(express.static(__dirname + '/assets'));
app.use("/assets", express.static("assets"));




//schema & model

//routes
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);

app.get('/', (req, res) => {
  res.sendFile('/views/index.html', { root: __dirname });
})

404
app.use((req, res) => {
  res.status(404).sendFile('./views/404.html', { root: __dirname });
});

app.listen(port, ()=> console.log(`Server is now running at port ${port}`));


/* 
login
  // we use email and apssword
  // once we login , we wil produce token
*/