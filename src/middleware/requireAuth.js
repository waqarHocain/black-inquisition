const db = require("../services/db");

const requireAuth = async (req, res, next) => {
  const id = req.session.id;
  if (id) {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (user) return next();
  }
  return res.sendStatus(401);
};

module.exports = requireAuth;
