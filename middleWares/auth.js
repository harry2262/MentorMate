const ErrorHandler = require("../utils/errorHandlers");
const User = require("../models/user");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");

// Check if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const jwtToken = req.cookies.jwtToken;
  if (!jwtToken) {
    return next(new ErrorHandler('Login first, your token either missing or expired', 404));
  }
  // console.log('token is ' + jwtToken);
  const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      return next(new ErrorHandler('Invalid token', 404));
    } else {
      // console.log('Decoded token: ' + decodedToken);
      const user = await User.findById(decodedToken._id);
      if (!user) {
        return next(new ErrorHandler("User not found.", 404));
      }
      req.user = user;
      next();
    }


    // TODO coros
    // res.header(
    //   "Access-Control-Allow-Origin",
    //   "https://frontend-main-v1.vercel.app",
    //   "http://localhost:3000"
    // );
  });
});

