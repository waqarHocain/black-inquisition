const router = require("express").Router();

// local imports
const userController = require("../controllers/user.controller");

router.get("/profile", userController.profile);

router.post("/jobs/apply/:jobId", userController.applyJob);
router.get("/jobs/apply/:jobId/success", userController.applyJobSuccess);

module.exports = router;
