const router = require("express").Router();

// local imports
const authController = require("../controllers/auth.controller");

router
  .route("/signup")
  .get(authController.renderSignupTemplate)
  .post(authController.signup);

router
  .route("/login")
  .get(authController.renderLoginTemplate)
  .post(authController.login);

module.exports = router;
