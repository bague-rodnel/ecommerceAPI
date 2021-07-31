const jwt = require("jsonwebtoken");
const secret = "CourseBookingAPI";
//const secret = process.env.ACCESS_TOKEN_SECRET;

module.exports.createAccessToken = (user) => {
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	}

  const options = {
    expiresIn: '1h'
  }
	return jwt.sign(data, secret, {});
};

module.exports.requireAdmin = (req, res, next) => {
  if (req.isAdmin) {
    next();
  } else {
    res.status(403).send({ error: "This operation is forbidden" });
  }
}

module.exports.requireNonAdmin = (req, res, next) => {
  if ( !req.isAdmin ) {
    next();
  } else {
    res.status(403).send({ error: "This route is forbidden. Normal users only." });
  }
}

module.exports.verify = (req, res, next) => {
  let token = req.headers.authorization;

  if (typeof token != "undefined") {
  	token = token.split(' ')[1];

  	return jwt.verify(token, secret, (err, decoded) => {
  		if (err) {
  			res.status(401).send({ error: "Authentication failed." });
        return false;
  		} else {
        req.userID = decoded.id;
        req.isAdmin = decoded.isAdmin; // probably useful later
  			next(); 
  		}
  	});
  } else {
  	res.status(401).send({ error: "Authentication failed." });
    return false;
  }
};

module.exports.decode = (token) => {
	if (typeof token !== "undefined") {
		token = token.split(' ')[1];

		return jwt.verify(token, secret, (err, data) => {
			if (err) {
				return null;
			} else {
				let payload = jwt.decode(token, {complete: true}).payload;

				return payload;
			}
		});
	} else {
		return null;
	}
};