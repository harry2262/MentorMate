const User = require("../models/user");
const Buddy = require("../models/buddy");
const ErrorHandler = require("../utils/errorHandlers");
const Session = require("../models/session");
const catchAsyncErrors = require("../middleWares/catchAsyncErrors");
exports.allScheduledSessions = catchAsyncErrors(async (req, res) => {
  const { buddyId } = req.body;
  console.log(buddyId);
  const buddy = await Buddy.findById(buddyId).populate("sessions");

  if (!buddy) {
    return res.status(404).json({ error: "Buddy not found" });
  }

  const scheduledSessions = buddy.sessions;
  res.status(200).json(scheduledSessions);
});

// Controller to get all sessions with the status "Pending" for a specific buddy
exports.allRequestedSessions = catchAsyncErrors(async (req, res) => {
  const { buddyId } = req.body;
  const buddy = await Buddy.findById(buddyId).populate("sessions");

  if (!buddy) {
    return res.status(404).json({ error: "Buddy not found" });
  }

  const pendingSessions = buddy.sessions.filter(
    (session) => session.status === "PENDING",
  );
  res.status(200).json(pendingSessions);
});

// Controller to reject a session request for a specific buddy by changing its status to "Rejected"
exports.rejectSessionRequest = catchAsyncErrors(async (req, res) => {
  const { sessionId } = req.body;

  const session = await Session.findById(sessionId);
  // Update session status to "Rejected"
  session.status = "REJECTED";
  session.save();

  res.status(200).json(session);
});

// Controller to get all completed sessions of a specific buddy
exports.getAllPreviousSessions = catchAsyncErrors(async (req, res) => {
  const { buddyId } = req.body;
  const buddy = await Buddy.findById(buddyId).populate("sessions");

  if (!buddy) {
    return res.status(404).json({ error: "Buddy not found" });
  }

  const completedSessions = buddy.sessions.filter(
    (session) => session.status === "COMPLETED",
  );
  res.status(200).json(completedSessions);
});

// Controller to approve a session for a specific buddy by changing its status to "Approved"
exports.approveSession = catchAsyncErrors(async (req, res) => {
  const { sessionId } = req.body;

  const session = await Session.findById(sessionId);
  // Update session status to "Rejected"
  session.status = "APPROVED";
  session.save();

  res.status(200).json(session);
});
exports.findBuddyByName = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.params;
  const users = await User.find({ name });

  const buddyPromises = users.map(async (user) =>
    Buddy.find({ user_id: user._id }),
  );
  const buddies = await Promise.all(buddyPromises);
  res.status(200).json(buddies);
});

exports.findBuddyByBranch = catchAsyncErrors(async (req, res, next) => {
  const { branch } = req.params;
  const users = await User.find({ branch });

  const buddyPromises = users.map(async (user) =>
    Buddy.find({ user_id: user._id }),
  );
  const buddies = await Promise.all(buddyPromises);
  res.status(200).json(buddies);
});
// exports.findBuddyBySubject = catchAsyncErrors(async (req, res, next) => {
//   const { subject } = req.params;
//   const users = await User.find({ subject });
//
//   const buddyPromises = users.map(async (user) =>
//     Buddy.find({ user_id: user._id }),
//   );
//   const buddies = await Promise.all(buddyPromises);
//   res.status(200).json(buddies);
// });
