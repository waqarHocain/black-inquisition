const db = require("../services/db");

const homepage = (req, res) => {
  res.render("index");
};

const updates = (req, res) => {
  res.render("updates");
};

const chooseRole = (req, res) => {
  res.render("signupAs");
};

const listJobs = async (req, res) => {
  const jobs = await db.job.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  res.render("allJobs", { jobs });
};

module.exports = {
  homepage,
  updates,
  chooseRole,
  listJobs,
};
