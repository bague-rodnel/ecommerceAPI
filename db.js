const mongoose = require('mongoose');

const connectionParams = { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useCreateIndex:true, 
  useFindAndModify: false 
};

module.exports = function connectDB() {
  mongoose.connect(process.env.DB, connectionParams)
            .then( con => {
              console.log(`MongoDB Database connected with HOST: ${con.connection.host}`);
            })
}