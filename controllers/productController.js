const User = require("./../models/User");
const bcrypt = require("bcrypt");
const auth = require("../auth");


module.exports.getAllOrders = () => {

}

module.exports.getAllOrders = () => {

}

module.exports.getAllOrders = () => {

}

module.exports.getAllOrders = () => {

}

module.exports.getAllOrders = () => {

}

module.exports.getAllOrders = () => {

}
module.exports.getAllUsers = (req, res) => {
  User.find().then(( result, err ) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};

//CHECK IF EMAIL EXISTS
module.exports.checkEmailExists = (thisEmail) => {
  return User.findOne({ email: thisEmail }).then((result) => {
    return result;
  })
};

//REGISTER USER
//to hash the password: https://www.npmjs.com/package/bcrypt
//hashSync is a funtion of bcrypt that encrypts the password and the 10 is a number of times it runs the encryption

module.exports.registerUser = (req, res) => {
  this.checkEmailExists(req.body.email).then( result => {
    if (!result) {
      let newUser = new User(req.body);
      newUser.password = bcrypt.hashSync(req.body.password, 10);

      return newUser.save().then(( result, err ) => {
        if(err){
          res.send(err);
        } else {
          result.password = "********";
          res.send(result);
        }
      })
    } else {
      res.send("email already registered.");
    }
  });
}


//USER LOGIN
  //- we use email and password
  //- once we login, we will produce token
  //- compareSync - compare password from user and database

module.exports.loginUser = (req, res) => {
  this.checkEmailExists(req.body.email).then( result => {
    if(!result){
      res.send(false); //User doesn't exist
    } else {
      console.log("found email");
      const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password); //returns boolean
      if(isPasswordCorrect){
        res.send({access: auth.createAccessToken(result)});
      } else {
        res.send(false); //password didn't match
      } 
    }
  });
}

// module.exports.getProfile = (data) => {
//   return User.findById(data.userId).then( result => {
//     result.password = "********";
//     return result;
//   });
// };

module.exports.getProfile = (req, res) => {
  // console.log(req);
  // const token = req.headers.authorization;
  const userData = auth.decode(req.headers.authorization)

  return User.findById(userData.id).then( result => {
    result.password = "********";
    res.send(result);
  });
}
