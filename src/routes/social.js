const router = require("express").Router();

const requireAuth = require("../middleware/requireAuth");
const socialController = require("../controllers/social.controller");

// public routes
router.get("/people", socialController.getAllProfiles);
router.get("/people/:id", socialController.getPublicProfile);

// auth protected routes
router.post("/people/friend", requireAuth, socialController.sendFriendRequest);

router.post(
  "/acceptRequest",
  requireAuth,
  socialController.acceptFriendRequest
);

router.delete(
  "/deleteRequest",
  requireAuth,
  socialController.deleteFriendRequest
);

module.exports = router;
