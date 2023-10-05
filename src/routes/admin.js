const router = require("express").Router();

// local imports
const adminController = require("../controllers/admin.controller");

router.get("/dashboard", adminController.renderDashboard);
router.get("/dashboard/:companyId", adminController.renderCompanyProfile);
router.get("/dashboard/u/:userId", adminController.renderUserProfile);

router.post("/dashboard/:companyId/approve", adminController.approveCompany);
router.post("/dashboard/:companyId/decline", adminController.deleteCompany);

router.post("/dashboard/u/:userId/approve", adminController.approveUser);
router.post("/dashboard/u/:userId/decline", adminController.deleteUser);

module.exports = router;
