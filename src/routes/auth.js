const router = require("express").Router();

// local imports
const authController = require("../controllers/auth.controller");

router
  .route("/user/signup")
  .get(authController.renderSignupTemplate)
  .post(authController.signup);

router.route("/company/signup").get(authController.renderCompanySignupTemplate);

router
  .route("/login")
  .get(authController.renderLoginTemplate)
  .post(authController.login);

module.exports = router;
