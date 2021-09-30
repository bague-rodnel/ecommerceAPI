const auth = require( "../middlewares/auth" );


// create and send token and save in cookie
const sendToken = (user, statusCode, res) => {
  // create jwt
  const token = auth.createAccessToken( user );

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    access: token
  })
}

module.exports = sendToken;