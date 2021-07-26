const jwt = require("jsonwebtoken");
const secret = "CourseBookingAPI";

// create token
module.exports.createAccessToken = (user) => {
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	}

	return jwt.sign(data, secret, {});
};

module.exports.requireAdmin = (req, res, next) => {
  let token = req.headers.authorization;
	
	let payload = module.exports.decode(token);
	if (payload.isAdmin) {
		next();
	} else {
		res.status(403).send({ error: "This operation is forbidden" });
	}
}

// verify token
module.exports.verify = (req, res, next) => {
  let token = req.headers.authorization;

  if (typeof token != "undefined") {
  	// token = token.slice(7, token.length); 
  	token = token.split(' ')[1];

  	return jwt.verify(token, secret, (err, decoded) => {
  		if (err) {
  			return res.status(401).send({ error: "Authentication failed." });
  		} else {
        req.isAdmin = decoded.isAdmin; // probably useful later
  			next(); 
  		}
  	});
  } else {
  	return res.status(401).send({ error: "Authentication failed." });
  }
};

module.exports.decode = (token) => {
	if (typeof token !== "undefined") {
		//token = token.slice(7, token.length); // remove 'Bearer' in authorization
		token = token.split(' ')[1];

		return jwt.verify(token, secret, (err, data) => {
			if (err) {
				return null;
			} else {
				let payload = jwt.decode(token, {complete: true}).payload;

        console.log("[DEBUG] auth.js > decode()");
				console.log(payload);

				return payload;
				// decode() decodes the token and gets the payload
				// payload is the data from the token we initially
				// created when we log in
			}
		});
	} else {
		return null;
	}
};