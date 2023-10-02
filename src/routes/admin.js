const router = require("express").Router();

// local imports
const adminController = require("../controllers/admin.controller");

router.get("/dashboard", adminController.renderDashboard);

module.exports = router;
