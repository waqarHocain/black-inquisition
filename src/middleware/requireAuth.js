const db = require("../services/db");
const jwt = require("../services/jwt");

const requireAuth = async (req, res, next) => {
  const token = req.session.token;
  const id = req.session.id;

  if (token && id) {
    const decodedToken = jwt.verifyToken(token);

    if (decodedToken && decodedToken.id === id) return next();
  }
  return res.sendStatus(401);
};

module.exports = requireAuth;
