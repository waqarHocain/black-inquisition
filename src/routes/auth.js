const router = require("express").Router();

// local imports
const authController = require("../controllers/auth.controller");

router.get("/signup", authController.signup);
router.get("/login", authController.login);

module.exports = router;
