const router = require("express").Router();

// local imports
const requireAuth = require("../middleware/requireAuth");
const profileController = require("../controllers/userProfile.controller");

router.get("/profile", requireAuth, profileController.profile);

module.exports = router;
