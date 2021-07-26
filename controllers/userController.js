const User = require("./../models/User");
const bcrypt = require("bcrypt");
const auth = require("../auth");

module.exports.getAllUsers = (req, res) => {
  User.find({}).then( (result, error) => {
    if (error) {
      res.status(500).send({ error: error });
    } else {
      res.status(200).send( result );
    }
  })
}

//CHECK IF EMAIL EXISTS
this.findByEmail = (thisEmail) => {
  return User.findOne({ email: thisEmail }).then((result) => {
    return result;
  })
};

//REGISTER USER
//to hash the password: https://www.npmjs.com/package/bcrypt
//hashSync is a funtion of bcrypt that encrypts the password and the 10 is a number of times it runs the encryption

module.exports.registerUser = (req, res) => {
  this.findByEmail(req.body.email).then( foundUser => {
    if (!foundUser) {
      let newUser = new User(req.body);
      newUser.password = bcrypt.hashSync(req.body.password, 10);

      newUser.save().then(( result, err ) => {
        if(err){
          res.status(500).send({ error: err });
        } else {
          result.password = "********";
          res.status(201).send(result);
        }
      })
    } else {
      res.status(409).send({ error: "Email is already in use." });
    }
  });
}

module.exports.loginUser = (req, res) => {
  this.findByEmail(req.body.email).then( foundUser => {
    if(!foundUser){
      res.status(401).send({ error: "email/password is not correct" }); //User doesn't exist
    } else {
      const isPasswordCorrect = bcrypt.compareSync(req.body.password, foundUser.password); //returns boolean
      if(isPasswordCorrect){
        res.status(200).send({ access: auth.createAccessToken(foundUser) });
      } else {
        res.status(401).send({ error: "email/password is not correct" }); //password didn't match
      } 
    }
  });
}

module.exports.getLoggedUserInfo = (req, res) => {
  let userData = auth.decode(req.headers.authorization)

  User.findById(userData.id).then( foundUser => {
    if (foundUser) {
      foundUser.password = "********";
      res.status(200).send(foundUser);
    } else {
      res.status(404).send({ error: "User not found." });
    }
  });
}

module.exports.getUserByID = (req, res) => {
  let userID = req.params.userID;

  User.findById(userID).then( foundUser => {
    if (foundUser) {
      foundUser.password = "********";
      res.status(200).send(foundUser);
    } else {
      res.status(404).send({ error: "User not found." });
    }
  })
}

module.exports.updateUserByID = (req, res) => {
  let userID = req.params.userID;

  User.findByIdAndUpdate(userID, req.body, {new: true}).then( result => {
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(500).send({ error: "Unable to process update." })
    }
  })
}