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

const jobDetails = async (req, res) => {
  const job = await db.job.findUnique({
    where: {
      id: req.params.jobId,
    },
  });
  if (!job) return res.sendStatus(404);
  return res.render("publicJobDetail", { job });
};

module.exports = {
  homepage,
  updates,
  chooseRole,
  listJobs,
  jobDetails,
};
