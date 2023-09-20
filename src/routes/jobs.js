const router = require("express").Router();

// local imports
const requireAuth = require("../middleware/requireAuth");
const jobsController = require("../controllers/jobs.controller");

router.route("/").get(requireAuth, jobsController.getJobs);

module.exports = router;
