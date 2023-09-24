const router = require("express").Router();

// local imports
const publicController = require("../controllers/public.controller");

router.get("/", publicController.homepage);
router.get("/updates", publicController.updates);
router.get("/signup-as", publicController.chooseRole);

module.exports = router;
