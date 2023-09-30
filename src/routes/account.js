const router = require("express").Router();

router.get("/unverified", (req, res) => {
  return res.render("unverified");
});

module.exports = router;
