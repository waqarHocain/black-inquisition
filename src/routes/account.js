const router = require("express").Router();
const db = require("../services/db");
const { ROLES } = require("../config");

router.get("/unverified", async (req, res) => {
  if (!req.session.verified) {
    // fetch fresh state from db
    const user = await db.user.findUnique({
      where: {
        id: req.session.id,
      },
    });

    if (user && user.verified) {
      return res.redirect(`/${user.role.toLowerCase()}/profile`);
    }

    return res.render("unverified");
  }

  // redirect to homepage
  return res.redirect("/");
});

module.exports = router;
