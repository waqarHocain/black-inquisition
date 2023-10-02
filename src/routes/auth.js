const router = require("express").Router();

// local imports
const authController = require("../controllers/auth.controller");

// user registration
router
  .route("/user/signup")
  .get(authController.renderSignupTemplate)
  .post(authController.signup);

// company registration
router
  .route("/company/signup")
  .get(authController.renderCompanySignupTemplate)
  .post(authController.companySignup);

// admin login
router
  .route("/admin/login")
  .get(authController.renderAdminLoginTemplate)
  .post(authController.adminLogin);

router
  .route("/login")
  .get(authController.renderLoginTemplate)
  .post(authController.login);

router.get("/logout", authController.logout);

module.exports = router;
