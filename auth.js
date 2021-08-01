const jwt = require("jsonwebtoken");
// const secret = "CourseBookingAPI";
const secret = process.env.ACCESS_TOKEN_SECRET || '33bdfcd5ef87f17718134b04bc22ab66d41ca7d51e24c792850a91eadc26c214';
const refresh = process.env.REFRESH_TOKEN_SECRET || 'eb49a9778f01c388250176733a9b5024557e5e168d6fcd05357f9f5d24a01375';


module.exports.createAccessToken = (user) => {
  // const secret = process.env.ACCESS_TOKEN_SECRET || '33bdfcd5ef87f17718134b04bc22ab66d41ca7d51e24c792850a91eadc26c214';
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

// module.exports.createRefreshToken = (user) => {
// 	const data = {
// 		id: user._id,
// 		email: user.email,
// 		isAdmin: user.isAdmin
// 	}

//   const options = {
//     expiresIn: '1y'
//   }
// 	return jwt.sign(data, secret, {});
// };

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