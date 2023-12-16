const db = require("../services/db");
const jwt = require("../services/jwt");
const { ROLES } = require("../config");

const checkVerified = async (req, res, next) => {
  if (req.user && req.user.verified) {
    return next();
  }

  // refetch latest user state
  const user = await db.user.findUnique({
    where: {
      id: req.user.id,
    },
  });

  if (user && user.verified) {
    // update value in session
    const token = jwt.generateToken({
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      verified: true,
    });
    req.session.token = token;
    return next();
  }

  return res.redirect("/account/unverified");
};

module.exports = checkVerified;
