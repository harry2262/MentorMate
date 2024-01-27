const express = require("express");
const router = express.Router();
const buddyController = require("../controllers/buddy");
router.get("/api/v1/buddy/requests", buddyController.allRequestedSessions);
router.get("/api/v1/buddy/schedule", buddyController.allScheduledSessions);
router.get(
  "/api/v1/buddy/previousSessions",
  buddyController.getAllPreviousSessions,
);
router.patch("/api/v1/buddy/approveSession", buddyController.approveSession);
router.patch(
  "/api/v1/buddy/rejectSession",
  buddyController.rejectSessionRequest,
);
router.get("/api/v1/buddy/findByName/:name", buddyController.findBuddyByName);
router.get(
  "/api/v1/buddy/findByBranch/:branch",
  buddyController.findBuddyByBranch,
);
module.exports = router;
