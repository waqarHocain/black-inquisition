const router = require("express").Router();

// local imports
const authController = require("../controllers/auth.controller");
const uploader = require("../middleware/multer");

// user registration
router
  .route("/user/signup")
  .get(authController.renderSignupTemplate)
  .post(uploader.single("avatar"), authController.signup);

// company registration
router
  .route("/company/signup")
  .get(authController.renderCompanySignupTemplate)
  .post(uploader.single("avatar"), authController.companySignup);

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
