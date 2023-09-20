const router = require("express").Router();

// local imports
const jobsController = require("../controllers/jobs.controller");

router.route("/").get(jobsController.getJobs);

module.exports = router;
