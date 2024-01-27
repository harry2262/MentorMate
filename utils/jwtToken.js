const sendToken = (user, statusCode, res) => {
  // create jwt token
  const token = user.getJwtToken();
  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "None",
    // secure: true, // commented for testing, because this is only for https request.
  };
  
  res.status(statusCode).cookie("jwtToken", token, options).json({
    success: true,
    message: "Welcome back !!",
    token,
    user,
  });
};

module.exports = sendToken;
