const router = require("express").Router();

// local imports
const profileController = require("../controllers/userProfile.controller");

router.get("/profile", profileController.profile);

module.exports = router;
