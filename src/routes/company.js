const router = require("express").Router();

// local imports
const companyController = require("../controllers/company.controller");

router.route("/jobs").get(companyController.getJobs);

module.exports = router;
