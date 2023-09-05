const db = require("../services/db");
const getCookie = require("../utils/getCookie");

const requireAuth = async (req, res, next) => {
  // TODO: use req.session instead
  const id = getCookie(req, "id");
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
