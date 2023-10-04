const jwt = require("../services/jwt");

const requireAuth = async (req, res, next) => {
  const token = req.session.token;
  const id = req.session.id;

  if (token && id) {
    const decodedToken = jwt.verifyToken(token);

    if (decodedToken && decodedToken.id === id) {
      req.user = decodedToken;
      return next();
    }
  }
  return res.redirect("/auth/login");
};

module.exports = requireAuth;
