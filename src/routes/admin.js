const router = require("express").Router();

// local imports
const adminController = require("../controllers/admin.controller");

router.get("/dashboard", adminController.renderDashboard);
router.get("/dashboard/:companyId", adminController.renderCompanyProfile);

router.post("/dashboard/:companyId/approve", adminController.approveCompany);
router.post("/dashboard/:companyId/decline", adminController.deleteCompany);

module.exports = router;
