const db = require("../services/db");
const { ROLES } = require("../config");

const checkVerified = async (req, res, next) => {
  if (req.session.verified) {
    return next();
  }

  // refetch latest user state
  const user = await db.user.findUnique({
    where: {
      id: req.session.id,
    },
  });

  if (user && user.verified) {
    // update value in session
    req.session.verified = true;
    return next();
  }

  return res.redirect("/account/unverified");
};

module.exports = checkVerified;
