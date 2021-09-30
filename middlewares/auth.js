const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../models/User");

module.exports.createAccessToken = (user) => {
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	}

	const secret = process.env.ACCESS_TOKEN_SECRET;
  const options = {
    expiresIn: process.env.JWT_EXPIRES_TIME
  }
	return jwt.sign(data, secret, options);
};

module.exports.requireAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    return next(new ErrorHandler("This operation is forbidden", 403));
  }
}

module.exports.requireNonAdmin = (req, res, next) => {
  if ( !req.user.isAdmin ) {
    next();
  } else {
    return next(new ErrorHandler("This route is forbidden. Normal users only.", 403));
  }
}

module.exports.verify = (req, res, next) => {
	const secret = process.env.ACCESS_TOKEN_SECRET;
  // let token = req.headers.authorization;

  console.log(`req.cookies: `, req.cookies);
  const {token} = req.cookies;

  if (typeof token != "undefined") {
  	// token = token.split(' ')[1];

  	return jwt.verify(token, secret, async (err, decoded) => {
  		if (err) {
     		return next(new ErrorHandler("Authentication failed.", 401));
  		} else {
        req.user = await User.findById(decoded.id); ;
  			next(); 
  		}
  	});
  } else {
    return next(new ErrorHandler("Authentication failed.", 401));
  }
};

// module.exports.decode = (token) => {
// 	const secret = process.env.ACCESS_TOKEN_SECRET;
// 	const {token} = req.cookies;

// 	if (typeof token !== "undefined") {
// 		// token = token.split(' ')[1];

// 		return jwt.verify(token, secret, (err, data) => {
// 			if (err) {
// 				return null;
// 			} else {
// 				const payload = jwt.decode(token, {complete: true}).payload;
// 				return payload;
// 			}
// 		});
// 	} else {
// 		return null;
// 	}
// };