const db = require("../services/db");

const profile = async (req, res) => {
  const user = await db.user.findUnique({
    where: {
      id: req.user.id,
    },
  });
  if (!user) throw new Error("Couldn't find user");

  const recentJobs = await db.job.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
  });

  res.render("profile", { user, recentJobs });
};

module.exports = {
  profile,
};
