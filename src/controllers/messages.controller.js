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

  const messages = await db.message.findMany({
    where: {
      OR: [
        {
          fromUserId: req.session.id,
        },
        {
          toUserId: req.session.id,
        },
      ],
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  res.render("messageUser", { user, messages });
};

const listChats = async (req, res) => {
  const messages = await db.message.findMany({
    where: {
      OR: [
        {
          fromUserId: req.session.id,
        },
        {
          toUserId: req.session.id,
        },
      ],
    },
  });
  if (messages.length === 0) return res.render("messages", { users: null });

  const ids = [];
  const currentUserId = BigInt(req.session.id);
  messages.forEach((msg) => {
    if (!ids.includes(msg.fromUserId) && msg.fromUserId !== currentUserId)
      ids.push(msg.fromUserId);
    if (!ids.includes(msg.toUserId) && msg.toUserId !== currentUserId)
      ids.push(msg.toUserId);
  });
  const users = await db.user.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    select: {
      id: true,
      name: true,
      photo: true,
    },
  });

  res.render("messages", { users });
};

module.exports = {
  msgUser,
  listChats,
};
