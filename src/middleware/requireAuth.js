const db = require("../services/db");

const requireAuth = async (req, res, next) => {
  console.log("middleware session ", req.session);
  if (req.session.id) {
    const user = await db.user.findUnique({
      where: {
        id: req.session.id,
      },
    });
    if (user) return next();
  }
  return res.sendStatus(401);
};

module.exports = requireAuth;
