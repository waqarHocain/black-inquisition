const router = require("express").Router();

// local imports
const companyController = require("../controllers/company.controller");

router.route("/jobs").get(companyController.getJobs);
router
  .route("/jobs/new")
  .get(companyController.renderCreateJobTemplate)
  .post(companyController.createJob);

// single job detail view
router.get("/jobs/:jobId", companyController.jobDetail);
router.route("/profile").get(companyController.profile);

module.exports = router;
