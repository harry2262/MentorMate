const User = require("../models/user");
const Session = require("../models/session");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/errorHandlers");
const catchAsyncErrors = require("../middleWares/catchAsyncErrors");
// const { redis } = require("../config/redis");
const { setValue, getValue, deleteKey } = require('../config/redis');

module.exports.isAuthenticated_get = (req, res) => {
  // res.header(
  //   "Access-Control-Allow-Origin",
  //   "https://frontend-main-v1.vercel.app",
  //   "http://localhost:3000"
  // );
  if (req.error) {
    return res.send(error);
  }
  res.status(200).json({ success: true, user: req.user });
  res.send("ok");
};

module.exports.test_get = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  res.cookie("token", "test-token", options);
  res.status(200).json({
    success: true,
    message:
      "Welcome to the API, this is test route, Server running successfully !!",
  });
};

module.exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body; // password and email must be trim.
  // check if email and password are entered or not
  if (!email) {
    return next(new ErrorHandler("Please enter user id", 400));
  }
  if (!password) {
    return next(new ErrorHandler("Please enter password", 400));
  }
  let user;
  if (email.includes("@")) {
    user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid Email or Password", 401));
    }
  } else {
    user = await User.findOne({ userId: email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid user id or Password", 401));
    }
  }
  // check password is correct or not
  const isPasswordMatched = await user.checkPassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Id or Password", 401));
  }
  sendToken(user, 200, res);
});

module.exports.signupUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  // console.log(name, email, password);
  if (!name) {
    return next(new ErrorHandler("Invalid Name", 400));
  }
  if (!email) {
    return next(new ErrorHandler("Invalid e-mail", 400));
  }
  if (!password) {
    return next(new ErrorHandler("Invalid Password", 400));
  }
  try {
    const user = await User.create({ name, email, password, id: email });
    if (user) {
      // console.log("user created");
      res
        .status(200)
        .json({ success: true, message: "Signup successfully, Try to login." });
    }
  } catch (err) {
    return next(new ErrorHandler(err, 404));
  }
});

module.exports.logout = catchAsyncErrors(async (req, res) => {
  const options = {
    expires: new Date(Date.now()),
    // httpOnly: true,
    // sameSite: "None",
    // secure: true,
  };
  res.status(200).cookie("jwtToken", null, options).json({
    success: true,
    message: "Logged out !!",
  });
});

module.exports.getProfile = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.id;

  if (!userId) {
    return next(new ErrorHandler("Error: Wrong URL", 404));
  }

  // if the key is present in Redis
  const cachedUser = await getValue(`users:${userId}`);
  if (cachedUser) {
    return res.status(200).json({ success: true, user: JSON.parse(cachedUser) });
  }

  // if ky is not present in redis, take from mongoDb.
  const user = await User.findOne({ id: userId });

  if (!user) {
    return next(new ErrorHandler("No user found with this id.", 404));
  }

  // cache the user data in redis ,which expire in 5-hour
  await setValue(`users:${userId}`, JSON.stringify(user), 5 * 60 * 60); // 5hr
  return res.status(200).json({ success: true, user });
});

module.exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  if (!req.user.id) {
    return next(new ErrorHandler("Please enter a valid Id", 500));
  }
  const oldUser = await User.findById(req.user._id);
  if (!oldUser) {
    return next(new ErrorHandler("User not found", 404));
  }
  const newUser = {
    name: req.body.name,
    // id: req.body.id,
    // for id we are not changing anything here, we must handle the uniqueness of our id.

    // email: req.body.email,
    // can't update email.

    // password: oldUser.password,
    // we are not providing anything to update password here, we can have a separate route for that.

    phone: req.body.phone,
    college: req.body.college,
    branch: req.body.branch,
    is_graduate: req.body.is_graduate,
    semester: req.body.semester,
    linkedIn: req.body.linkedIn,
    github: req.body.github,
  };
  const user = await User.findByIdAndUpdate(req.user._id, newUser, {
    new: true,
  });
  res.status(200).json({ success: true, user });
});

module.exports.clearAllNotification = catchAsyncErrors(async (req, res) => {
  if (req.body.user._id) {
    const user = await User.findByIdAndUpdate(
      req.body.user._id,
      { $set: { notifications: [] } },
      { new: true },
    );
    res.status(200).json({ success: true, message: "All notification cleared." });
  } else {
    res.status(404).json({ success: false, message: "Wrong body." });
  }
});

module.exports.deleteNotificationBYId = catchAsyncErrors(async (req, res) => {
  if (req.body.user._id) {
    const notificationId = rq.body.notificationId;
    const updatedUser = await User.findByIdAndUpdate(
      req.body.user._id,
      { $pull: { notifications: { _id: new ObjectId(notificationId) } } },
      { new: true },
    );
    res.status(200).json({ success: true, updatedUser });
  } else {
    res.status(404).json({ success: false, message: "Wrong body." });
  }
});

module.exports.findUserByName = catchAsyncErrors(async (req, res) => {
  const query = req.body.search_query; // it must be trim 

  // Check if the data is present in Redis
  const cachedUsers = await getValue(`usersByName:${query}`);
  /*
  * here we can try one more thing, 
  * like when we are caching a user with name or branch,
  * then we can cache only the user._id from the mongoDb,
  * instead of caching the whole user object again, as this will stored into 
  * our RAM, but we have to do 2 operation, first find the 
  * user._id using the provided name, and then find the users:user._id,
  * which we got from the 1st key, then corresponding to the user._id
  * we will return the user object.    
  */

  if (cachedUsers) {
    return res.status(200).json({ success: true, users: JSON.parse(cachedUsers) });
  }

  // If data is not present in Redis, query MongoDB
  const users = await User.find({ name: query });

  await setValue(`usersByName:${query}`, JSON.stringify(users), 15 * 60); // 15 minutes

  res.status(200).json({ success: true, users });
});

module.exports.findUserByBranch = catchAsyncErrors(async (req, res) => {
  const query = req.body.search_query; // it must be trim 
  // Check if the data is present in Redis
  const cachedUsers = await getValue(`usersByBranch:${query}`);
  if (cachedUsers) {
    return res.status(200).json({ success: true, users: JSON.parse(cachedUsers) });
  }

  // If data is not present in Redis, query MongoDB
  const users = await User.find({ branch: query });

  await setValue(`usersByName:${query}`, JSON.stringify(users), 15 * 60); // 15 minutes

  res.status(200).json({ success: true, users });
});

module.exports.requestSession = catchAsyncErrors(async (req, res) => {
  console.log(req.body);
  const { buddy_ids, user_ids, bookedFor, topic } = req.body;
  //here we are getting an array of buddy and user.

  const result = await Session.create(
    {
      to: buddy_ids,
      by: user_ids,
      date: bookedFor,
      topic,
    },
    { new: true },
  );
  res.status(200).json({ success: true, result });
});

module.exports.sendMessage = catchAsyncErrors(async (req, res) => {
  const sender_id = req.body.user._id;
  const message = req.body.message;
  const receiver_id = req.body.receiver_id;
  //we are assuming it as array of senders and array of receivers.
  //So that when we have to send notification to many users from
  // system then we can do this in one click.

  const notification = {
    _id: new ObjectId(),
    sender: new ObjectId(sender_id),
    content: message,
    timestamp: new Date(),
  };

  const result = await User.updateMany(
    { _id: { $in: receiver_id.map((id) => new ObjectId(id)) } },
    { $push: { notifications: notification } },
  );

  if (result) {
    return res.status(200).json({ success: true, result });
  }
  return res.status(404).json({ success: false, message: "Error" });
});


module.exports.getAllSessionInfo = catchAsyncErrors(async (req, res) => {
  const userId = req.body.user._id;

  // if the data is present in cache
  const cachedSessionInfoList = await getValue(`sessionInfoList:${userId}`);
  if (cachedSessionInfoList) {
    return res.status(200).json({ success: true, sessionInfoList: JSON.parse(cachedSessionInfoList) });
  }

  // if data is not cached
  const pastSessionList = await User.findById(userId).select("+past_session");
  const sessionInfoList = await Session.find({ _id: { $in: pastSessionList } });

  if (!sessionInfoList || sessionInfoList.length === 0) {
    return res.status(200).json({
      success: true,
      message: "You never attended any session.",
    });
  }

  // Cache the sessionInfoList in Redis with a 15minutes expiration
  await setValue(`sessionInfoList:${userId}`, JSON.stringify(sessionInfoList), 15 * 60);

  res.status(200).json({ success: true, sessionInfoList });
});