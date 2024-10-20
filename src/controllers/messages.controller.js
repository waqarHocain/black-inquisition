const db = require("../services/db");

const msgUser = async (req, res) => {
  let userId;
  try {
    userId = BigInt(req.params.userId);
  } catch (e) {
    console.error(e);
    return res.sendStatus(404);
  }

  const user = await db.user.findUnique({
    where: { id: userId },
  });
  if (!user) return res.status(404);

  res.render("messageUser", { user });
};

const listChats = async (req, res) => {
  res.json({ msg: "ok" });
};

module.exports = {
  msgUser,
  listChats,
};
