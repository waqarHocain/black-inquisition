const router = require("express").Router();
const db = require("../services/db");
const { ROLES } = require("../config");

router.get("/unverified", async (req, res) => {
  if (!req.user.verified) {
    // fetch fresh state from db
    if (req.user.role === ROLES.USER) {
      const user = await db.user.findUnique({
        where: {
          id: req.user.id,
        },
      });

      if (user && user.verified) return res.redirect("/user/profile");
    } else if (req.user.role === ROLES.COMPANY) {
      const company = await db.company.findUnique({
        where: {
          id: req.user.id,
        },
      });

      if (company && company.verified) return res.redirect("/company/profile");
    }
    return res.render("unverified");
  }

  return res.redirect("/");
});

module.exports = router;
