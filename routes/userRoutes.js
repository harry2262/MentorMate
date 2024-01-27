const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

const { isAuthenticatedUser } = require("../middleWares/auth");

router.get("/is-authenticated", isAuthenticatedUser, userController.isAuthenticated_get,);
router.get("/test", userController.test_get);

router.route('/signup').post(userController.signupUser);
router.route('/login').post(userController.loginUser);
router.route('/logout').get(userController.logout);

router.route('/profile/:id').post(isAuthenticatedUser, userController.getProfile)
  .patch(isAuthenticatedUser, userController.updateProfile);

router.route('/clearAllNotification').delete(userController.clearAllNotification);
router.route("/deleteNotificationById").delete(userController.deleteNotificationBYId);

router.route('/findUserByName').post(userController.findUserByName);
router.route('/findUserByBranch').post(userController.findUserByBranch);

router.route('/requestSession').post(userController.requestSession);
router.route('/sendMessage').post(userController.sendMessage);

router.route('/getAllSessionInfo').post(userController.getAllSessionInfo);

module.exports = router;
